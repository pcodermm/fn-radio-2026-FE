# FN Radio Frontend

Create React App + TypeScript frontend integrated against the FN Radio backend contract in:

- [API_RESPONSE.md](../fn_radio_backend/API_RESPONSE.md)
- [swagger.yaml](../fn_radio_backend/swagger.yaml)

## What is implemented

- Axios client with centralized envelope unwrapping and error normalization
- Trusted-device auth flow for `register`, `login`, `me`, and `logout`
- Persistent `fnr_token`, `fnr_user`, and `fnr_device_id` local storage handling
- Typed API modules for auth, home, blogs, podcasts, categories, and settings
- Routed pages for home, blogs, blog detail, podcasts, podcast detail, login, register, and profile
- Query param support for `category`, `featured`, `search`, and `page`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the example:

```bash
copy .env.example .env
```

3. Confirm the backend is running and that `REACT_APP_API_BASE_URL` points to the real API URL.

Example Laragon value:

```env
REACT_APP_API_BASE_URL=http://localhost/fn_radio_backend/public/api
REACT_APP_APP_VERSION=1.0.0
```

4. Start the frontend:

```bash
npm start
```

The app runs at `http://localhost:3000`.

## Scripts

- `npm start`: run the development server
- `npm test`: run the CRA test runner
- `npm run build`: create a production build

## Project structure

```text
src/
  api/
    client.ts
    endpoints/
  app/
  components/
  features/
  lib/
  pages/
  styles/
  types/
```

## Notes

- Authenticated requests automatically send `Authorization`, `X-Device-Id`, `X-App-Platform`, and `X-App-Version`.
- Register and login automatically send `device_id`, `device_name`, `platform=web`, and `app_version` in the request body.
- Public content pages do not send trusted-device headers.
- Settings are treated as a dynamic key/value map and rendered defensively.
