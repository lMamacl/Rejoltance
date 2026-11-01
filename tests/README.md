# tests — testy automatyczne (EU6)

| Projekt | Co sprawdza | Czas |
|---|---|---|
| `Rejoltance.Kernel.Tests` | reguły R‑nn, determinizm, projekcja (fog of war), katalog kart | < 2 s |
| `Rejoltance.Architecture.Tests` | granice modułów, brak mutowalnego stanu statycznego, kontrakty bez logiki | < 1 s |
| `Rejoltance.Server.Tests` | REST, hub SignalR (prawdziwy klient), zgodność formatu `MatchView` z próbką TS | ~ 20 s |
| `Rejoltance.AppHost.Tests` | cały AppHost startuje, `/health` OK (`Category=Integration`) | ~ 1–3 min |

```bash
dotnet test Rejoltance.slnx --filter "Category!=Integration"        # codziennie
dotnet test tests/Rejoltance.AppHost.Tests                           # przed PR zmieniającym AppHost (zawsze w CI)
dotnet test --filter "FullyQualifiedName~R04"                        # jedna reguła
```

Testy klienta: `npm --prefix src/web test`. Konwencja nazw: `Rnn_opis_zachowania` dla reguł gry, zdanie po angielsku dla reszty.
