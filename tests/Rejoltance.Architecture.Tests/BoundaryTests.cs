using System.Collections;
using System.Reflection;
using NetArchTest.Rules;
using Rejoltance.Content;
using Rejoltance.Contracts;
using Rejoltance.Kernel;

namespace Rejoltance.Architecture.Tests;

/// <summary>
/// Fitness functions: module boundaries from docs/03-architecture/MAP.md checked on every build.
/// Breaking one = red CI. Arrows point down only: Server → Kernel → Content → Contracts.
/// </summary>
public sealed class BoundaryTests
{
    private static readonly Assembly ContractsAssembly = typeof(Intent).Assembly;
    private static readonly Assembly ContentAssembly = typeof(CardCatalog).Assembly;
    private static readonly Assembly KernelAssembly = typeof(MatchEngine).Assembly;

    public static TheoryData<string, string> ForbiddenDependencies => new()
    {
        { "Rejoltance.Contracts", "Rejoltance.Content" },
        { "Rejoltance.Contracts", "Rejoltance.Kernel" },
        { "Rejoltance.Contracts", "Rejoltance.Server" },
        { "Rejoltance.Content", "Rejoltance.Kernel" },
        { "Rejoltance.Content", "Rejoltance.Server" },
        { "Rejoltance.Kernel", "Rejoltance.Server" },
        { "Rejoltance.Kernel", "Microsoft.AspNetCore" },
        { "Rejoltance.Kernel", "Microsoft.EntityFrameworkCore" },
        { "Rejoltance.Kernel", "System.Net" },
    };

    [Theory]
    [MemberData(nameof(ForbiddenDependencies))]
    public void Module_does_not_depend_on(string module, string forbidden)
    {
        var assembly = module switch
        {
            "Rejoltance.Contracts" => ContractsAssembly,
            "Rejoltance.Content" => ContentAssembly,
            _ => KernelAssembly,
        };

        var result = Types.InAssembly(assembly).ShouldNot().HaveDependencyOn(forbidden).GetResult();

        Assert.True(result.IsSuccessful, $"{module} must not depend on {forbidden}: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Fact]
    public void Contracts_contain_no_logic_types()
    {
        var offenders = ContractsAssembly.GetTypes()
            .Where(t => t.IsClass && t.IsPublic && !t.IsAbstract && !IsRecord(t))
            .Select(t => t.FullName)
            .ToList();

        Assert.True(offenders.Count == 0, $"Contracts may only hold records/enums: {string.Join(", ", offenders)}");
    }

    /// <summary>
    /// No mutable global state in the domain (the old CardLibrary.Instance problem).
    /// Catches non-readonly statics, auto-property backing fields with setters, and readonly statics of mutable collection types.
    /// </summary>
    [Fact]
    public void Domain_has_no_mutable_static_state()
    {
        var offenders = new[] { ContractsAssembly, ContentAssembly, KernelAssembly }
            .SelectMany(a => a.GetTypes())
            .Where(t => !t.IsDefined(typeof(System.Runtime.CompilerServices.CompilerGeneratedAttribute)))
            .SelectMany(t => t.GetFields(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.DeclaredOnly)
                .Where(f => !f.IsLiteral && (!f.IsInitOnly || IsMutableCollection(f.FieldType)))
                .Select(f => $"{t.FullName}.{f.Name}"))
            .ToList();

        Assert.True(offenders.Count == 0, $"Mutable static state found: {string.Join(", ", offenders)}");
    }

    private static bool IsRecord(Type type) => type.GetMethod("<Clone>$") is not null;

    private static bool IsMutableCollection(Type type)
    {
        if (type.IsArray)
        {
            return true;
        }

        if (type == typeof(string) || !typeof(IEnumerable).IsAssignableFrom(type))
        {
            return false;
        }

        var ns = type.Namespace ?? "";
        return !ns.StartsWith("System.Collections.Frozen", StringComparison.Ordinal)
            && !ns.StartsWith("System.Collections.Immutable", StringComparison.Ordinal);
    }
}
