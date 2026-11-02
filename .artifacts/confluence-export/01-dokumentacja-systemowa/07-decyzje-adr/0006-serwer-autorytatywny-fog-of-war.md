<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0006-serwer-autorytatywny-fog-of-war.md @ a2bf2a4 (2026-11-02) -->
# ADR-0006: Serwer autorytatywny, fog of war w projekcji

- **Status:** zatwierdzona (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** reguły R-80…R-84, `Projection.cs`, `MatchHub.cs`

## Kontekst i problem

Prototyp działa w modelu P2P (peer-to-peer, przez PeerJS). Host trzyma cały stan gry. Gość może poświęcić jednostkę hosta
i zna jego rękę oraz kolejność talii (wyciek przez `uid`). Złośliwy host może też wykonać skrypt u gościa (XSS, cross-site scripting). [V]
Gra online musi być uczciwa.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| P2P jak w prototypie | zero serwera | oszustwa, brak reconnectu | nie do obrony |
| Stan wysyłany do klienta, ukrywany w UI | prosto | podgląd w DevTools | oszustwa |
| **Serwer autorytatywny + projekcja per miejsce** | jedno miejsce prawdy i fog of war (ukrycie informacji przed przeciwnikiem) | serwer trzyma mecze w pamięci | reconnect i skalowanie do zrobienia |

## Decyzja

W kontekście gry online z ukrytą informacją, wybieramy **serwer ASP.NET Core + SignalR, który przyjmuje tylko `Intent`, przetwarza intencje meczu
sekwencyjnie (semafor) i wysyła każdemu graczowi `MatchView` z `Projection.ToView`** zamiast P2P, aby oszustwo przez klienta było niemożliwe,
akceptując utrzymanie sesji w pamięci serwera (jeden proces; skalowanie poza zakresem projektu).

## Konsekwencje

### Pozytywne

- Fog of war jest testowany (R-80) i nie zależy od UI.
- Bot gra przez ten sam kontrakt co człowiek.

### Negatywne / ryzyka

- Restart serwera kończy trwające mecze (akceptowalne; replay z seeda — E6-S05).
