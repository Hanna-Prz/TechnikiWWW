Mini Sklep 🛒

Prosty sklep internetowy stworzony w Node.js + Express z SQLite, umożliwiający przeglądanie produktów, dodawanie do koszyka oraz wystawianie opinii.

Funkcjonalności

Wyświetlanie listy produktów z możliwością sortowania po nazwie i cenie

Szczegóły produktu z możliwością dodania do koszyka

Koszyk z możliwością usuwania produktów i podglądem łącznej ceny

Dynamiczna aktualizacja stanu magazynowego po dodaniu produktów do koszyka

Formularz dodawania opinii (feedback) do produktów

Responsywny design

Technologie

Frontend: HTML, CSS, JavaScript (fetch API)

Backend: Node.js, Express.js

Baza danych: SQLite

Inne: dotenv, cors

Struktura projektu
mini-sklep/
│ server.js
│ package.json
│ .env
│ models/
│   db.js
│ public/
│   index.html
│   cart.html
│   product.html
│   css/
│     style.css
│   js/
│     main.js
│     cart.js
Instalacja

Sklonuj repozytorium lub pobierz projekt:

git clone <repo-url>
cd mini-sklep

Zainstaluj zależności:

npm install

Utwórz plik .env (jeśli potrzebujesz zmiany portu lub konfiguracji):

PORT=4000

Uruchom serwer:

node server.js

Otwórz w przeglądarce: http://localhost:4000

API
Produkty
Endpoint	Metoda	Opis
/api/products	GET	Pobierz listę produktów (parametr `sort=name
/api/products/:id	GET	Pobierz szczegóły produktu
/api/products	POST	Dodaj nowy produkt
/api/products/:id	PUT	Edytuj produkt
/api/products/:id	DELETE	Usuń produkt
Koszyk
Endpoint	Metoda	Opis
/api/cart	GET	Pobierz produkty w koszyku
/api/cart	POST	Dodaj produkt do koszyka
/api/cart/:id	PUT	Zmień ilość produktu w koszyku
/api/cart/:id	DELETE	Usuń produkt z koszyka
Opinie (Feedback)
Endpoint	Metoda	Opis
/api/feedback/:productId	GET	Pobierz opinie dla produktu
/api/feedback	POST	Dodaj nową opinię
Uwagi

Projekt jest w pełni funkcjonalny lokalnie i nie wymaga serwera zdalnego

Produkty są seedowane przy pierwszym uruchomieniu serwera