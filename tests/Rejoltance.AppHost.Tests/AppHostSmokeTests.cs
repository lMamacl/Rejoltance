namespace Rejoltance.AppHost.Tests;

/// <summary>
/// Proves "one command starts everything": boots the real AppHost and checks the server is healthy.
/// Local run needs Node.js (for the web resource) and no Docker. On Windows, Smart App Control may block it
/// (docs/00-start/jak-zaczac.md#problemy).
/// </summary>
[Trait("Category", "Integration")]
public sealed class AppHostSmokeTests
{
    private static readonly TimeSpan Timeout = TimeSpan.FromMinutes(3);

    [Fact]
    public async Task Server_starts_and_reports_healthy()
    {
        using var cts = new CancellationTokenSource(Timeout * 2);
        var ct = cts.Token;
        var appHost = await DistributedApplicationTestingBuilder.CreateAsync<Projects.Rejoltance_AppHost>(ct);
        await using var app = await appHost.BuildAsync(ct).WaitAsync(Timeout, ct);
        await app.StartAsync(ct).WaitAsync(Timeout, ct);

        await app.ResourceNotifications.WaitForResourceHealthyAsync("server", ct).WaitAsync(Timeout, ct);
        using var http = app.CreateHttpClient("server");
        using var health = await http.GetAsync("/health", ct);
        using var cards = await http.GetAsync("/api/cards", ct);

        Assert.Equal(HttpStatusCode.OK, health.StatusCode);
        Assert.Equal(HttpStatusCode.OK, cards.StatusCode);
    }

    [Fact]
    public async Task Web_client_is_served_and_proxies_the_api()
    {
        using var cts = new CancellationTokenSource(Timeout * 2);
        var ct = cts.Token;
        var appHost = await DistributedApplicationTestingBuilder.CreateAsync<Projects.Rejoltance_AppHost>(ct);
        await using var app = await appHost.BuildAsync(ct).WaitAsync(Timeout, ct);
        await app.StartAsync(ct).WaitAsync(Timeout, ct);

        await app.ResourceNotifications.WaitForResourceAsync("web", KnownResourceStates.Running, ct).WaitAsync(Timeout, ct);
        using var http = app.CreateHttpClient("web");
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
