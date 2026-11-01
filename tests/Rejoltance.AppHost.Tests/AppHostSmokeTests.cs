using Aspire.Hosting;
using Microsoft.Extensions.Logging;

namespace Rejoltance.AppHost.Tests;

/// <summary>
/// Starts the real AppHost once for all smoke tests. No dashboard and plain HTTP, so it also runs on CI runners
/// without a trusted dev certificate. AppHost and resource logs go to the console (visible in the CI log).
/// </summary>
public sealed class AppHostFixture : IAsyncLifetime
{
    public static readonly TimeSpan Timeout = TimeSpan.FromMinutes(3);

    public DistributedApplication App { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        using var cts = new CancellationTokenSource(Timeout);
        var appHost = await DistributedApplicationTestingBuilder.CreateAsync<Projects.Rejoltance_AppHost>(
            [],
            (options, _) =>
            {
                options.DisableDashboard = true;
                options.AllowUnsecuredTransport = true;
            },
            cts.Token);
        appHost.Services.AddLogging(logging =>
        {
            logging.SetMinimumLevel(LogLevel.Information);
            logging.AddFilter("Aspire.", LogLevel.Debug);
            logging.AddSimpleConsole(o => o.SingleLine = true);
        });

        App = await appHost.BuildAsync(cts.Token).WaitAsync(Timeout, cts.Token);
        await App.StartAsync(cts.Token).WaitAsync(Timeout, cts.Token);
    }

    public async Task DisposeAsync() => await App.DisposeAsync();
}

/// <summary>
/// Proves "one command starts everything": the real AppHost starts the server and the web client.
/// Local run needs Node.js (for the web resource) and no Docker. On Windows, Smart App Control may block it
/// (docs/00-start/jak-zaczac.md#problemy).
/// </summary>
[Trait("Category", "Integration")]
public sealed class AppHostSmokeTests(AppHostFixture fixture) : IClassFixture<AppHostFixture>
{
    [Fact]
    public async Task Server_starts_and_reports_healthy()
    {
        using var cts = new CancellationTokenSource(AppHostFixture.Timeout);
        var ct = cts.Token;

        await fixture.App.ResourceNotifications.WaitForResourceHealthyAsync("server", ct).WaitAsync(AppHostFixture.Timeout, ct);
        using var http = fixture.App.CreateHttpClient("server");
        using var health = await http.GetAsync("/health", ct);
        using var cards = await http.GetAsync("/api/cards", ct);

        Assert.Equal(HttpStatusCode.OK, health.StatusCode);
        Assert.Equal(HttpStatusCode.OK, cards.StatusCode);
    }

    [Fact]
    public async Task Web_client_is_served_and_proxies_the_api()
    {
        using var cts = new CancellationTokenSource(AppHostFixture.Timeout);
        var ct = cts.Token;

        await fixture.App.ResourceNotifications.WaitForResourceAsync("web", KnownResourceStates.Running, ct).WaitAsync(AppHostFixture.Timeout, ct);
        using var http = fixture.App.CreateHttpClient("web");
        var index = await GetWithRetryAsync(http, "/", ct);
        var info = await GetWithRetryAsync(http, "/api/info", ct);

        Assert.Contains("<div id=\"root\">", await index.Content.ReadAsStringAsync(ct), StringComparison.Ordinal);
        Assert.Contains("Rejoltance", await info.Content.ReadAsStringAsync(ct), StringComparison.Ordinal);
    }

    // Vite needs a moment after the process is "Running" before it accepts connections.
    private static async Task<HttpResponseMessage> GetWithRetryAsync(HttpClient http, string path, CancellationToken ct)
    {
        for (var attempt = 0; ; attempt++)
        {
            try
            {
                var response = await http.GetAsync(path, ct);
                if (response.IsSuccessStatusCode || attempt >= 30)
                {
                    return response;
                }
            }
            catch (HttpRequestException) when (attempt < 30)
            {
            }

            await Task.Delay(TimeSpan.FromSeconds(2), ct);
        }
    }
}
