W FOLDERZE ASSETS/ masz plik USUN MNIE.txt, i tak masz zrobić - cała apka potrzebuje folderu assets ale ma być on po prostu pusty









1. Wymagania

Node.js
 (zalecane LTS, np. 18.x)

Expo Go
 zainstalowane na telefonie (iOS/Android)

Konto w Matrix.org
 lub własny serwer Matrix
 (dla ciebie nie potrzebne do momentu kiedy nie chcesz sam stestować wysyłania info na martixa)

2. Klonowanie repozytorium
git clone 
cd PanicApp

3. Instalacja zależności
npm install

4. Uruchomienie projektu
npx expo start


Skanujesz QR kod aplikacją Expo Go.

Na iOS skanujesz QR aparatem, na Androidzie w aplikacji Expo Go.

5. Konfiguracja Matrix (opcjonalka)

W pliku .env dodaj swoje dane:

MATRIX_HOMESERVER=https://matrix.org
MATRIX_USER=@twojlogin:matrix.org
MATRIX_PASSWORD=twojehaslo



LISTA todo
 GUI – prosty i szybki interfejs
 Tryb „nagłego alarmu” – wysyłanie lokalizacji co X sekund
 Rejestrowanie i szyfrowanie trasy (np. przez 5 minut)
 Integracja z kontaktami alarmowymi
