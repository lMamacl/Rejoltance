# Rejoltance.ServiceDefaults

Wspólna konfiguracja usług z szablonu Aspire: OpenTelemetry (logi, metryki, trace w panelu Aspire), health checks (`/health`, `/alive`),
service discovery, odporność klientów HTTP. Używa: `builder.AddServiceDefaults()` + `app.MapDefaultEndpoints()` w serwerze.
Zmieniaj rzadko; właściciel: epik E6.
