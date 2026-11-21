using System.Text.Json;
using System.Text.Json.Serialization;

namespace Rejoltance.Content;

/// <summary>
/// A number in the card DSL: either a fixed value (<c>Amount: 3</c>) or a value counted when the effect resolves
/// (<c>Amount: { Count: "Blood" }</c>, optionally with <c>Div</c>, <c>Min</c> and <c>Max</c>), as in prototype/game/cards.js.
/// </summary>
[JsonConverter(typeof(DslNumberConverter))]
public sealed record DslNumber
{
    public int? Value { get; init; }
    public string? Count { get; init; }
    public int? Div { get; init; }
    public int? Min { get; init; }
    public int? Max { get; init; }

    public bool IsFixed => Value is not null;

    public static implicit operator DslNumber(int value) => new() { Value = value };
}

internal sealed class DslNumberConverter : JsonConverter<DslNumber>
{
    public override DslNumber? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        switch (reader.TokenType)
        {
            case JsonTokenType.Null:
                return null;
            case JsonTokenType.Number:
                return new DslNumber { Value = reader.GetInt32() };
            case JsonTokenType.StartObject:
                using (var doc = JsonDocument.ParseValue(ref reader))
                {
                    var root = doc.RootElement;
                    return new DslNumber
                    {
                        Count = root.TryGetProperty("Count", out var count) ? count.GetString() : null,
                        Div = Int(root, "Div"),
                        Min = Int(root, "Min"),
                        Max = Int(root, "Max"),
                    };
                }

            default:
                throw new JsonException($"Expected a number or a {{ Count: ... }} object, got {reader.TokenType}");
        }
    }

    public override void Write(Utf8JsonWriter writer, DslNumber value, JsonSerializerOptions options)
    {
        if (value.IsFixed)
        {
            writer.WriteNumberValue(value.Value!.Value);
            return;
        }

        writer.WriteStartObject();
        writer.WriteString("Count", value.Count);
        WriteIf(writer, "Div", value.Div);
        WriteIf(writer, "Min", value.Min);
        WriteIf(writer, "Max", value.Max);
        writer.WriteEndObject();
    }

    private static int? Int(JsonElement root, string name) =>
        root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Number ? value.GetInt32() : null;

    private static void WriteIf(Utf8JsonWriter writer, string name, int? value)
    {
        if (value is not null)
        {
            writer.WriteNumber(name, value.Value);
        }
    }
}

/// <summary>Reads a DSL field that the prototype writes either as one string or as an array of strings.</summary>
internal sealed class StringOrListConverter : JsonConverter<IReadOnlyList<string>>
{
    public override IReadOnlyList<string> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.TokenType switch
        {
            JsonTokenType.Null => [],
            JsonTokenType.String => [reader.GetString()!],
            JsonTokenType.StartArray => JsonSerializer.Deserialize<List<string>>(ref reader, options) ?? [],
            _ => throw new JsonException($"Expected a string or an array of strings, got {reader.TokenType}"),
        };

    public override void Write(Utf8JsonWriter writer, IReadOnlyList<string> value, JsonSerializerOptions options) =>
        JsonSerializer.Serialize(writer, value.ToList(), options);
}
