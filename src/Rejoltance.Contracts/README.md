# Rejoltance.Contracts — kontrakty

**Po co:** typy wymieniane między serwerem a klientem: `Intent`, `LegalAction`, `PendingInteraction`, `MatchView`, `DomainEvent`.

**Publiczne API:** wszystkie rekordy w tym projekcie. JSON: camelCase, enumy jako camelCase stringi, polimorfizm przez pole `type`.

**Niezmienniki:** zero logiki (test `Contracts_contain_no_logic_types`); zmiana = ADR + mirror w `src/web/src/contracts/index.ts` + odświeżenie `match-view.sample.json` (`UPDATE_CONTRACT_SAMPLES=1 dotnet test`) w **jednym PR**.

**Czego tu NIE ma:** walidacji, reguł, zależności od innych modułów.

**Jak testować:** `ContractSampleTests` (C#) + `src/web/src/contracts/contracts.test.ts` (TS).

**Właściciel:** wspólny — recenzja z obu stron (backend + frontend).
