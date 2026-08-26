# Echtzeit-Chat-App mit Event-Steuerung

Eine Full-Stack-Messaging-Anwendung, entwickelt mit **Java 21**, **Spring Boot**, **Apache Kafka** und **React Native (Expo)**.


---

## Technologie-Stack

### Backend
* **Kern:** Java 21, Spring Boot 4.1.0, Maven
* **Datenbank & Persistenz:** PostgreSQL, Spring Data JPA / Hibernate
* **Messaging & Streaming:** Apache Kafka, Zookeeper, Spring Kafka
* **Echtzeitkommunikation:** Spring WebSocket (STOMP)
* **Sicherheit:** Spring Security, JWT (JSON Web Tokens)
* **DevOps:** Docker, Docker Compose

### Frontend
* **Kern:** React Native (Expo SDK), Expo Router, TypeScript
* **Netzwerk:** Axios (REST), STOMP über WebSockets
* **UI:** Expo Linear Gradient, Stylesheet, Unterstützung für dynamische Designs (Dunkel-/Hellmodus)

---

## Funktionsweise & Wichtige Entscheidungen

### 1. Asynchrone Messaging-Pipeline
* **Entkoppeltes Event-Streaming:** Eingehende HTTP/WebSocket-Nachrichten werden sofort an Kafka-Topics gesendet.

Dies entlastet die WebSocket-Threads von Datenbankzugriffen, verhindert Engpässe und sorgt für reaktionsschnelle Client-Verbindungen auch unter Last.

* **Aktualisierungen mit geringer Latenz:** STOMP über WebSockets ermöglicht die bidirektionale Nachrichtenübermittlung an Web- und Mobilclients in Echtzeit.

### 2. Datenbankdesign & -optimierung
* **Relationales Schema:** Basierend auf PostgreSQL mit expliziter Indizierung, Fremdschlüsselbeschränkungen, zusammengesetzten Schlüsseln und Kaskadierungsregeln.

* **Effiziente Paginierung (`Slice<T>`):** Der Chatverlauf verwendet Spring Datas `Slice<T>` anstelle des standardmäßigen `Page<T>`.

Dadurch werden unnötige `COUNT(*)`-Abfragen bei jedem Scrollen vermieden, was das Abrufen von Nachrichten im Verlauf in React Natives invertierter `FlatList` deutlich beschleunigt.

### 3. Sicherheit

* **Zustandslose REST-Sicherheit:** Endpunkte werden durch Spring Security-Filterketten mit JWT-Bearer-Token geschützt.

* **Sichere WebSockets:** Verbindungsaufbau und STOMP-Subscriptions validieren JWT-Token direkt aus den Autorisierungsheadern, bevor eine aktive Sitzung hergestellt wird.

## Screenshots from the application
![loginScreen](readmeassets/loginForm.png)
![registerScreen](readmeassets/registerForm.png)
![registerScreenWithNonValidValues](readmeassets/invalidEntriesInRegisterForm.png)
![mainPageWithContactsAndChats](readmeassets/mainPage.png)
![chatPageWithChatList](readmeassets/chat.png)
