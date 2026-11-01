using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Rejoltance.Content;
using Rejoltance.Kernel;
using Rejoltance.Server.Data;
using Rejoltance.Server.Matches;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<ICardCatalog>(_ => CardCatalog.LoadEmbedded());
builder.Services.AddSingleton<MatchEngine>();
builder.Services.AddSingleton<Projection>();
builder.Services.AddSingleton<MatchSessionManager>();

builder.Services.AddDbContext<RejoltanceDb>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("rejoltance") ?? "Data Source=rejoltance.db"));

builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase)));
builder.Services.AddSignalR()
    .AddJsonProtocol(o => o.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase)));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Dev only: create the SQLite file on first run. Real schema changes go through EF migrations.
    using var scope = app.Services.CreateScope();
    scope.ServiceProvider.GetRequiredService<RejoltanceDb>().Database.EnsureCreated();
}

app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");
api.MapGet("/info", (MatchSessionManager sessions) => new { name = "Rejoltance", version = typeof(Program).Assembly.GetName().Version?.ToString(), activeMatches = sessions.ActiveMatches });
api.MapGet("/cards", (ICardCatalog catalog) => catalog.All.OrderBy(c => c.Id));
api.MapGet("/decks", (ICardCatalog catalog) => catalog.StarterDecks);

app.MapHub<MatchHub>("/api/hubs/match");

app.MapDefaultEndpoints();
app.MapFallbackToFile("index.html");

app.Run();

public partial class Program;
