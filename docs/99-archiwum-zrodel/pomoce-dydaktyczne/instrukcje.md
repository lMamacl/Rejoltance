# Instrukcja Operacyjna Pracowni Projektowej

Niniejszy dokument opisuje procedury administracyjne, konfigurację narzędzi ekosystemu Atlassian oraz zasady prowadzenia projektów w metodyce zwinnej (Scrum) w ramach przedmiotu *Projekt zespołowy*.

---

## 1. Zarządzanie Projektami, Użytkownikami i Uprawnieniami

### Uwierzytelnianie i Konta Użytkowników
- **Logowanie:** Uwierzytelnianie do wszystkich narzędzi odbywa się za pośrednictwem wydziałowego serwera **LDAP**.
- **Konta studenckie:** Studenci przypisani do danego cyklu posiadają konta utworzone według schematu `wi00000`, gdzie `00000` oznacza numer indeksu studenta.
- **Hasła:** Pierwsze logowanie, procedura odzyskiwania oraz bieżąca zmiana hasła realizowane są bezpośrednio przez uczelniany system LDAP.
- **Konta nauczycieli:** Prowadzący korzystają z kont zsynchronizowanych z systemem *Świerk*. Nauczyciele posiadają rozszerzone uprawnienia administracyjne (m.in. prawo do zakładania kont i projektów).

> [!CAUTION]
> **Ograniczenia Licencyjne:**
> Uczelniana licencja na udostępnione narzędzia (Jira, Confluence, Bitbucket) obejmuje **wyłącznie realizację projektów dydaktycznych**. Wykorzystywanie infrastruktury do prac o charakterze komercyjnym, badawczo-naukowym lub wspierającym organizację bieżącej pracy uczelni stanowi naruszenie warunków licencji.

---

### Zasady Nadawania Uprawnień
Wszystkie zintegrowane narzędzia bazują na centralnej bazie użytkowników i grup zdefiniowanej w aplikacji **Jira**. Wszelkie modyfikacje struktury uprawnień należy przeprowadzać wyłącznie na poziomie Jira.

Wyłącznie nauczyciele (członkowie grupy `jira-project-creators`) posiadają uprawnienia do:
1. Tworzenia projektów w systemach Jira i Bitbucket oraz przestrzeni (spaces) w Confluence;
2. Tworzenia grup roboczych i przypisywania do nich uczestników zajęć;
3. Konfigurowania ról i uprawnień w ramach poszczególnych projektów.

Uprawnienia dla studentów nadawane są w oparciu o dwa mechanizmy:
1. **Grupy użytkowników w Jira (rozwiązanie rekomendowane):** Umożliwia scentralizowane, spójne zarządzanie dostępem do wszystkich powiązanych usług (Jira, Confluence, Bitbucket).
2. **Role projektowe w Jira:** Każdy użytkownik przypisywany jest do danego projektu w jednej z trzech ról:
   - **Administrator:** Zarządzanie konfiguracją techniczną projektu;
   - **Product Owner:** Prowadzenie rejestru produktu, zarządzanie sprintami i priorytetami;
   - **Developer:** Standardowe uprawnienia wykonawcze członka zespołu projektowego.

---

## 2. Procedura Konfiguracji Narzędzi dla Zespołu

### Jira
1. Nauczyciel tworzy projekt w systemie Jira.
2. Po utworzeniu projektu nauczyciel ręcznie przypisuje odpowiednie role użytkownikom w danym zespole.

### Confluence
1. Nauczyciel tworzy w systemie Jira dedykowaną grupę użytkowników projektu i przypisuje do niej członków zespołu.
2. Nauczyciel zakłada przestrzeń projektową (*Space*) w Confluence.
3. Nauczyciel przechodzi do ustawień uprawnień przestrzeni (poprzez opcję `Space Tools` w lewym dolnym rogu ekranu lub menu `Spaces` → `Space directory` → `Space Details` [ikona `(i)`]).
4. Nauczyciel przypisuje uprawnienia utworzonej wcześniej grupie projektowej z Jira (rekomendowany zestaw: pełne prawa z wyłączeniem usuwania elementów oraz administrowania przestrzenią).

### Bitbucket
1. Nauczyciel tworzy repozytorium/projekt w systemie Bitbucket.
2. Nauczyciel przechodzi do ustawień projektu (ikona koła zębatego), a następnie w zakładce `Permissions` nadaje uprawnienia grupie projektowej z Jira (rekomendowane: pełne uprawnienia administracyjne dla zespołu).

---

### Szablony i Schematy Konfiguracyjne (Jira Schemes)
Domyślnie każdy nowo tworzony projekt Jira posiada niezależne schematy konfiguracyjne:
- schemat przepływu pracy (*Workflow Scheme*),
- schemat ekranów (*Screen Scheme*),
- schemat pól zgłoszeń (*Field Configuration Scheme*).

> [!TIP]
> **Standaryzacja Konfiguracji:**
> Aby zachować jednolity standard pracowni, w panelu administracyjnym projektu należy ustawić schematy dedykowane pracowni:
> - *Pracownia projektowa Workflow Scheme*
> - *Pracownia projektowa Issue Type Screen Scheme*
> - *Pracownia projektowa Field Configuration Scheme*
>
> Przy tworzeniu kolejnych projektów zaleca się skorzystanie z opcji **„Create with shared configuration”** i wskazanie wzorcowego, skonfigurowanego projektu (np. `2024-PT...`), co automatycznie powieli spójne reguły.

#### Standardowy Przepływ Pracy (Jira Software Workflow)
Zgłoszenia w cyklu życia przechodzą pomiędzy statusami:
$$\text{Open} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$
*(z możliwością ponownego otwarcia: $\text{Reopened}$)*.

---

## 3. Metodyka Realizacji: Praca w Sprintach (Scrum)

Realizacja projektu opiera się na iteracyjnym cyklu sprintów. Każdy sprint składa się z czterech ustrukturyzowanych etapów:

```
[1. Przygotowanie do Sprintu] ──> [2. Realizacja Sprintu] ──> [3. Zakończenie Sprintu] ──> [4. Kolejna Iteracja]
      (Planning / Backlog)              (Daily / Praca)              (Review / Retro)              (Planowanie)
```

### Krok 1: Przygotowanie do Sprintu

#### 1.1 Refinement Rejestru Produktu (Product Backlog Refinement)
- Product Owner (PO) na bieżąco aktualizuje i ustala priorytety elementów backlogu (*Product Backlog Items / Tasks*) w Jira.
- Cały zespół deweloperski analizuje, dekomponuje i doprecyzowuje historyjki użytkownika (*User Stories*).

#### 1.2 Estymacja Zadań
- Zespół przeprowadza szacowanie pracochłonności zadań wstępnie zakwalifikowanych do sprintu (rekomendowane użycie dodatku *Planning Poker* w Jira).
- Każde zadanie otrzymuje wycenę wyrażoną w punktach (*Story Points*).

#### 1.3 Planowanie Sprintu (Sprint Planning)
- Zespół wspólnie wybiera zadania z Product Backlogu do bieżącego sprintu.
- Zespół definiuje jasny, mierzalny **Cel Sprintu** (*Sprint Goal*).
- Z wybranych zadań formowany jest rejestr sprintu (*Sprint Backlog*) w Jira.

#### 1.4 Przypisanie Zadań
- Członkowie zespołu podejmują zadania lub zostają do nich przypisani w Jira.
- Status zadań kwalifikowanych do realizacji zostaje ustawiony na `To Do`.

---

### Krok 2: Realizacja Sprintu

#### 2.1 Spotkania Synchronizacyjne (Daily Scrum)
- Spotkania zespołu odbywają się za pośrednictwem platformy komunikacyjnej (np. MS Teams).
- **Zasada elastyczności:** Specyfika projektu uczelnianego nie narzuca sztywnych, codziennych spotkań. Spotkania synchronizacyjne organizowane są doraźnie, stosownie do bieżących potrzeb zespołu.
- Podczas synchronizacji każdy członek zespołu odpowiada na trzy pytania:
  1. *Co udało się zrealizować od ostatniego spotkania?*
  2. *Jakie zadania planuje wykonać w kolejnym kroku sprintu?*
  3. *Czy napotkano jakiekolwiek przeszkody lub blokery technologiczne?*
- Po spotkaniu deweloperzy aktualizują statusy zadań na tablicy Jira (`To Do` → `In Progress` → `Done`).

#### 2.2 Bieżąca Praca Deweloperska
- Realizacja przypisanych funkcjonalności zgodnie z przyjętymi kryteriami akceptacji.
- Regularne raportowanie postępów w Jira (m.in. poprzez komentarze do zadań).
- Skrupulatna ewidencja rzeczywistego czasu pracy za pomocą wbudowanej funkcji **Log Work** w Jira.

#### 2.3 Współpraca i Dokumentacja (Confluence)
- Confluence stanowi centralne repozytorium wiedzy i dokumentacji projektu.
- Zespół tworzy i aktualizuje strony projektowe, podręczniki, instrukcje wdrożeniowe oraz notatki ze spotkań.
- W zależności od fazy projektu w Confluence powstaje:
  - **dokumentacja techniczna:** opis konfiguracji środowiska, architektura systemu, specyfikacja API;
  - **dokumentacja projektowa:** diagramy UML, modele baz danych, makiety interfejsu użytkownika.

#### 2.4 Przegląd Kodu i Testowanie
- Obowiązkowe przeglądy kodu (*Code Review*) w systemie Bitbucket przed scaleniem zmian.
- Opracowanie testów jednostkowych i integracyjnych (element ten nabiera kluczowego znaczenia w Semestrze 2).
- Bieżąca aktualizacja dokumentacji i planów testów w systemie Confluence.

---

### Krok 3: Zakończenie Sprintu

#### 3.1 Przegląd Sprintu (Sprint Review)
- Wewnętrzna prezentacja ukończonych zadań w ramach zespołu.
- Demonstracja działającego przyrostu produktu (*Working Product Increment*).
- Zebranie informacji zwrotnej (*feedbacku*) od interesariuszy i prowadzącego.
- Aktualizacja Product Backlogu w oparciu o otrzymane uwagi.

#### 3.2 Retrospektywa Sprintu (Sprint Retrospective)
- Analiza przebiegu współpracy i efektywności procesów w zakończonym sprincie.
- Identyfikacja elementów, które funkcjonowały prawidłowo, oraz obszarów wymagających korekty.
- Sformułowanie konkretnych działań usprawniających na kolejną iterację.
- Sporządzenie i zarchiwizowanie notatki z wnioskami w Confluence.

#### 3.3 Formalne Zamknięcie Sprintu
- Przeniesienie nieukończonych zadań z powrotem do Product Backlogu z odpowiednią adnotacją.
- Analiza prędkości zespołu (*Velocity*).
- Weryfikacja wykresów spalania (*Burndown Chart*) oraz wygenerowanie raportów podsumowujących sprint w Jira.

---

### Krok 4: Przygotowanie do Kolejnego Sprintu
- Aktualizacja priorytetów w Product Backlogu na podstawie ustaleń ze Sprint Review i Retrospektywy.
- Wstępna selekcja zagadnień do kolejnej iteracji.
- Cały proces ma charakter ściśle iteracyjny — kolejny cykl rozpoczyna się od ponownego Sprint Planningu.

---

## 4. Wytyczne Dotyczące Wyboru Tematów Projektów

1. **Ustalanie tematów:** Tematy projektów przydzielane są formalnie w ramach przedmiotu *Projekt zespołowy*.
2. **Pula tematów:** Studenci dokonują wyboru z katalogu udostępnionego w sekcji *Tematy projektów*.
3. **Realizacja równoległa:** Dopuszcza się wybór i równoległą realizację tego samego tematu przez więcej niż jeden zespół projektowy.
4. **Rozszerzanie bazy:** Prowadzący zajęcia zastrzega sobie prawo do modyfikacji i rozbudowy katalogu tematów w trakcie semestru.
5. **Tematy własne:** Zespoły studenckie mogą zgłaszać własne propozycje tematów pod warunkiem uzyskania formalnej akceptacji ze strony prowadzącego zajęcia.
