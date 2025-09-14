1. Wymagania

Node.js
 (zalecane LTS, np. 18.x)

Expo Go
 zainstalowane na telefonie (iOS/Android)

Konto w Matrix.org
 lub własny serwer Matrix

2. Klonowanie repozytorium
git clone https://github.com/TwojNick/PanicApp.git
cd PanicApp

3. Instalacja zależności
npm install

4. Uruchomienie projektu
npx expo start


Skanujesz QR kod aplikacją Expo Go.

Na iOS skanujesz QR aparatem, na Androidzie w aplikacji Expo Go.

5. Konfiguracja Matrix

W pliku .env dodaj swoje dane:

MATRIX_HOMESERVER=https://matrix.org
MATRIX_USER=@twojlogin:matrix.org
MATRIX_PASSWORD=twojehaslo



LISTA todo
 GUI – prosty i szybki interfejs
 Tryb „nagłego alarmu” – wysyłanie lokalizacji co X sekund
 Rejestrowanie i szyfrowanie trasy (np. przez 5 minut)
 Integracja z kontaktami alarmowymi
