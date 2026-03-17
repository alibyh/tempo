# Russia Address Map

Mini web app with **Yandex Maps** and two dropdowns to pick Russian addresses. The map shows placemarks for the selected addresses.

## Stack

- React 18 + TypeScript
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

## Route / distance and CORB on GitHub Pages

The in-browser route request (Yandex JS API) can be blocked by **CORB** when the app is hosted on GitHub Pages. To get **road distance and the route line** working in production:

1. Deploy the proxy to **Vercel** (same repo is fine):
   - Push the repo (it contains an `api/` folder).
   - In [Vercel](https://vercel.com), import the project and deploy.
   - In the project **Settings → Environment Variables**, add `YANDEX_API_KEY` with the same Yandex API key you use for the map.
2. Set the proxy URL in your app:
   - For **local**: in `.env.local` add  
     `VITE_ROUTER_PROXY_URL=https://your-vercel-app.vercel.app/api/route`  
     (replace with your real Vercel URL).
   - For **GitHub Pages**: in the repo **Settings → Secrets and variables → Actions**, add a secret (e.g. `VITE_ROUTER_PROXY_URL`) and in the deploy workflow pass it as a build env var so the built app calls your Vercel proxy.

After that, the app will request the route via your proxy (no CORB), then show the distance and draw the road line on the map.
