# 6.3 Instrukcja wdrożenia i utrzymania

> Źródło prawdy: repo (powstaje przy story E6-S05 „Wdrożenie demo”). Dla administratora, nie dla programisty.

## Wymagania

Serwer / hosting, system, zasoby (CPU, RAM), domena i certyfikat HTTPS.

## Instalacja

1. <obraz kontenera z CI / komenda wdrożenia>
2. <zmienne środowiskowe — bez wartości sekretów>
3. <migracje bazy>

## Konfiguracja

| Ustawienie | Zmienna | Domyślnie | Opis |
|---|---|---|---|

## Monitorowanie

`/health`, `/alive`, logi i telemetria (OpenTelemetry), co sprawdzać codziennie.

## Kopie zapasowe i odtwarzanie

Co kopiujemy (baza), jak często, jak odtworzyć, kto odpowiada.

## Bezpieczeństwo

HTTPS, sekrety (gdzie przechowywane), aktualizacje zależności, dostęp administracyjny.

## Rozwiązywanie problemów i odtwarzanie po awarii

| Objaw | Przyczyna | Działanie |
|---|---|---|
