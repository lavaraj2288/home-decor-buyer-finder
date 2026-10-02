# HomeDecor Buyer Finder

A full-stack B2B discovery and outreach app for home decor sellers. Search US business listings through Google Places, enrich matching business websites with publicly listed professional emails from Hunter, and send personalized outreach through Resend. Buyer results are fetched live; this project does not use CSV files or seed buyer records.

## Features

- Search by product/category, buyer type, US location, optional keywords, and result count.
- Display normalized business details and Google Maps links returned by Google Places.
- Look up public business email addresses through Hunter when a website is available. Hunter is optional; missing or failed lookups leave email blank and do not fail the search.
- Compose and edit an outreach subject and message, then send through Resend.
- Display backend health, loading, empty, configuration, and error states.
- Responsive dashboard and buyer cards.

## Technology

- Frontend: React, Vite, Tailwind CSS, Axios, Lucide React
- Backend: Node.js, Express, Axios, dotenv, CORS
- External APIs: Google Places API (New), Hunter Domain Search API, Resend API

## Architecture

In production, Express serves the built React application and API from one domain. The frontend uses relative `/api/...` paths, so no production localhost URL or cross-domain API host is required.

```text
React
  ↓
Express
  ↓
Google Places API
  ↓
Hunter API (public email enrichment when configured)
  ↓
Buyer Results
  ↓
Resend API
  ↓
Email
```

Google Places and Hunter credentials are read only by the server; the browser never receives provider keys.

## Folder Structure

```text
HomeDecor-Buyer-Finder/
  client/
    src/
      components/
      pages/
  server/
    routes/
    services/
    .env.example
  README.md
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Express port; defaults to `5000`. |
| `GOOGLE_PLACES_API_KEY` | Yes for buyer search | Google API key with Places API (New) enabled. |
| `HUNTER_API_KEY` | No | Hunter API key; without it, search still works but email enrichment is skipped. |
| `RESEND_API_KEY` | Yes for sending | Resend API key. |
| `RESEND_FROM_EMAIL` | Yes for sending | Verified sender identity in Resend, for example `Your Brand <hello@yourdomain.com>`. |
| `FRONTEND_URL` | No | Allowed frontend origin; defaults to `http://localhost:5173`. Multiple origins may be comma-separated. |

Never commit `server/.env` or put provider credentials in client-side variables. The server ignores `.env`.

## API Setup

1. In Google Cloud, enable Places API (New), configure billing as required by Google, and create an API key restricted to the Places API.
2. Create a Hunter account/API key. This integration is optional; businesses without discovered public emails remain searchable.
3. Create a Resend API key and verify the sender domain/address used for `RESEND_FROM_EMAIL`.
4. Set the credentials in `server/.env`. Keep the key permissions and account usage within each provider's terms and limits.

## Installation

Backend:

```powershell
cd server
npm install
```

Frontend:

```powershell
cd client
npm install
```

## Run Locally

```powershell
cd server
npm run dev
```

In a second terminal:

```powershell
cd client
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`. Vite proxies `/api` to the local Express server during development. The production client uses the same relative API paths and contains no backend host setting.

## API Endpoints

- `GET /api/health` returns service status.
- `GET /api/buyers?keyword=lamps&buyerType=Interior%20Designers&location=United%20States&keywords=luxury&limit=10` searches Places and optionally enriches results with Hunter.
- `POST /api/email/send` accepts JSON with `to`, `subject`, and `message`, and sends through Resend.

## Testing

- Frontend production build: `cd client; npm run build`
- Frontend lint: `cd client; npm run lint`
- Backend syntax check: `node --check server.js` from `server/`
- Health check: open `http://localhost:5000/api/health` after starting the backend.
- Without API credentials, `/api/health` remains available; buyer search and email sending return explicit configuration errors instead of fabricated data.

## Production Deployment

The repository includes `render.yaml` for a single Render Node web service rooted at the repository root. The build installs both applications and builds `client/dist`; the start command runs Express, which serves the frontend and API from the same public URL.

Equivalent Render commands:

```sh
npm install --prefix server && npm install --prefix client && npm run build --prefix client
npm start --prefix server
```

Set the `GOOGLE_PLACES_API_KEY`, `HUNTER_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `FRONTEND_URL` environment variables in Render. `FRONTEND_URL` should be the deployed HTTPS origin. Render supplies `PORT` automatically. Use a verified Resend sender and keep all provider keys in Render's server-side environment settings.

## Demonstration

1. Start locally using the commands above, or deploy the Blueprint and open its single Render URL.
2. Confirm the navbar reports **Backend Connected**.
3. Search a product/category and buyer type. A valid Google Places API key is required for live results; Hunter adds public email addresses when configured.
4. Open a result with an email, edit the recipient, subject, and message, then send. Resend credentials and a verified sender are required for delivery.
5. Use the deployed website URL as the mentor demo link; the API and frontend share that domain.

## Security Considerations

- Provider credentials are read from server environment variables and are never included in API responses or client bundles.
- CORS is restricted to `FRONTEND_URL` (or the local Vite origin by default); same-origin production requests do not require cross-origin access.
- Google Places and Hunter results may be subject to provider quotas, billing, licensing, and permitted-use requirements. Respect their terms and data retention policies.
- Email is sent only after the user selects a discovered public email and confirms the message. Use Resend with an authenticated sender and comply with applicable anti-spam and privacy laws.
- Configure production HTTPS, strict secret management, rate limiting, and monitoring before public deployment.
