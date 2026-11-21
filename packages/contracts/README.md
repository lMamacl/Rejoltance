# packages/contracts — kontrakty serwer ↔ klient

**Po co:** jedno miejsce, w którym zdefiniowane są typy wymieniane między serwerem a klientem (konstytucja, art. IV).

- `src/view.ts` — `MatchView`, `LegalAction`, `PendingInteraction` (widok jednego gracza);
- `src/intents.ts` — `Intent` jako schemat zod (serwer sprawdza nim każdą wiadomość, typ TS powstaje ze schematu);
- `src/events.ts` — `DomainEvent`;
- `src/protocol.ts` — zdarzenia Socket.IO (`startSandbox`, `sendIntent`, `matchUpdated`) i odpowiedzi REST (`CardInfo`, `DeckInfo`);
- `samples/match-view.sample.json` — próbka widoku używana w testach klienta; odświeżanie: `UPDATE_CONTRACT_SAMPLES=1 npm test`.

**Zasady:** pakiet nie importuje innych pakietów. Zmiana kontraktu wymaga ADR; `tsc` pokaże wtedy wszystkie miejsca do poprawy w serwerze, silniku i kliencie.
