# ADR-0006: Serwer autorytatywny, fog of war w projekcji

- **Status:** accepted (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** reguły R-80…R-84, `Projection.cs`, `MatchHub.cs`

## Kontekst i problem

Prototyp działa P2P (PeerJS): host trzyma cały stan, gość może poświęcić jednostkę hosta, zna jego rękę i kolejność talii (wyciek przez `uid`),
a złośliwy host może wykonać skrypt u gościa (XSS). [V] Gra online wymaga uczciwości.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| P2P jak w prototypie | zero serwera | oszustwa, brak reconnectu | nie do obrony |
| Stan wysyłany do klienta, ukrywany w UI | prosto | podgląd w DevTools | oszustwa |
| **Serwer autorytatywny + projekcja per miejsce** | jedno miejsce prawdy i fog of war | serwer trzyma mecze w pamięci | reconnect i skalowanie do zrobienia |

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
