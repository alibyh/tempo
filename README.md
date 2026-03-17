# Russia Address Map

Mini web app with **Yandex Maps** and two dropdowns to pick Russian addresses. The map shows placemarks for the selected addresses.

## Stack

- React 19 + TypeScript
- Vite
- [@pbe/react-yandex-maps](https://pbe-react-yandex-maps.vercel.app/)

## Yandex API key

1. Get a key: [Yandex Maps API](https://developer.tech.yandex.ru/) → create a key for **JavaScript API**.
2. Copy `.env.example` to `.env.local` and set your key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set VITE_YANDEX_API_KEY=your_actual_key
   ```
3. **If you see "Invalid API key"**: the key is often valid but **referrer restrictions** block localhost. In the [Developer Dashboard](https://developer.tech.yandex.ru/), open your key → **Edit** → under **HTTP Referer restrictions** add:
   - `http://localhost`
   - `http://127.0.0.1`
   Then save and wait up to **15 minutes**.

## Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Build

```bash
npm run build
```
