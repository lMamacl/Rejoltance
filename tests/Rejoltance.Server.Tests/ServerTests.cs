using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Rejoltance.Content;
using Rejoltance.Contracts;
using Rejoltance.Kernel;

namespace Rejoltance.Server.Tests;

public sealed class ServerTests(ServerFactory factory) : IClassFixture<ServerFactory>
{
    [Theory]
    [InlineData("/health")]
    [InlineData("/api/info")]
    [InlineData("/api/cards")]
    [InlineData("/api/decks")]
    public async Task Endpoint_responds_ok(string path)
    {
        using var client = factory.CreateClient();

        using var response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Hub_starts_sandbox_and_accepts_mulligan()
    {
        await using var hub = factory.CreateHubConnection();
        await hub.StartAsync();

        var view = await hub.InvokeAsync<MatchView>("StartSandbox", "MachineAggro", "TeaMaidCombo", 42UL);
        var after = await hub.InvokeAsync<MatchView>("SendIntent", view.MatchId, Wire(new MulliganIntent([])));

        Assert.Equal(4, view.You.Hand.Count);
        Assert.Equal(4, view.Opponent.HandCount);
        Assert.Null(after.Pending);
    }

    [Fact]
    public async Task Hub_rejects_unimplemented_intents_with_a_message()
    {
        await using var hub = factory.CreateHubConnection();
        await hub.StartAsync();
        var view = await hub.InvokeAsync<MatchView>("StartSandbox", "MachineAggro", "TeaMaidCombo", 1UL);

        var ex = await Assert.ThrowsAsync<HubException>(() => hub.InvokeAsync<MatchView>("SendIntent", view.MatchId, Wire(new EndStepIntent())));

        Assert.Contains("not implemented yet", ex.Message);
    }

    /// <summary>Serialize through the base type so the "type" discriminator is included, exactly like the web client sends it.</summary>
    private static JsonElement Wire(Intent intent) => JsonSerializer.SerializeToElement(intent, JsonSerializerOptions.Web);
}

/// <summary>
/// Contract check C# ↔ TypeScript without a code generator: the C# side must serialize exactly the committed sample,
/// and src/web type-checks the same file against its MatchView type (src/web/src/contracts/contracts.test.ts).
/// Regenerate after an approved contract change: set UPDATE_CONTRACT_SAMPLES=1 and run the tests.
/// </summary>
public sealed class ContractSampleTests
{
    private static readonly JsonSerializerOptions WireOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
    };

    [Fact]
    public void MatchView_wire_format_matches_committed_sample()
    {
        var catalog = CardCatalog.LoadEmbedded();
        var engine = new MatchEngine(catalog);
        var deck = catalog.StarterDecks.Single(d => d.Name == "MachineAggro").Cards;
        var state = engine.NewMatch(new MatchSetup("sample", 2026, deck, deck)).State;
        var json = JsonSerializer.Serialize(new Projection(catalog, engine).ToView(state, 0), WireOptions).ReplaceLineEndings("\n") + "\n";

        var path = Path.Combine(RepoRoot(), "src", "web", "src", "contracts", "match-view.sample.json");
        if (Environment.GetEnvironmentVariable("UPDATE_CONTRACT_SAMPLES") == "1")
        {
            File.WriteAllText(path, json);
        }

        Assert.True(File.Exists(path), $"Missing {path}. Run tests with UPDATE_CONTRACT_SAMPLES=1 to create it.");
        Assert.Equal(File.ReadAllText(path).ReplaceLineEndings("\n"), json);
    }

    private static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "Rejoltance.slnx")))
        {
            dir = dir.Parent;
        }

        return dir?.FullName ?? throw new InvalidOperationException("Repository root (Rejoltance.slnx) not found");
    }
}
