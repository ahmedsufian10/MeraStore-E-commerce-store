# Mera Store

Mera Store is the Weeks 7-8 capstone implementation from the supplied PDF. It uses the requested MERN stack and keeps the storefront deliberately editorial, fast, and professional.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `server/.env.example` to `server/.env`.
3. Add the MongoDB Atlas URI and the other test-mode values to `server/.env`.
4. Run `npm install`.
5. Run `npm run seed` once to create the demo admin, categories, and products.
6. Run `npm run dev`.
7. Open `http://localhost:5173`.

The server runs on port 5000 and Vite serves the React client on port 5173. In production, run `npm run build` and serve `client/dist` from the Express server.

## Demo accounts

- Admin: `admin@merastore.com` / `MeraStoreAdmin123!`
- Customer: create an account from the Register page.

Change the admin password before using the project outside local development.

## Tech stack coverage

- Node.js, Express, MongoDB Atlas, Mongoose
- JWT, bcrypt, express-validator
- Stripe PaymentIntent and React Stripe Elements in test mode
- Multer, Cloudinary hooks, Nodemailer hooks
- dotenv, Nodemon, Axios
- React, Vite, React Router DOM, Context API
- Plain CSS with responsive breakpoints and no component library
- Recharts for the admin revenue chart

## Important configuration

The project never includes real secrets. Cloudinary, Stripe, and email services are enabled when their environment variables are present. Without those optional credentials, the app still gives clear demo-mode feedback while MongoDB, JWT, validation, and the full route structure remain active.

## Email confirmation

Set these values in `server/.env` to enable Nodemailer order confirmations:

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-mailbox@example.com
EMAIL_PASS=your-smtp-password-or-app-password
FROM_EMAIL=Mera Store <your-mailbox@example.com>
```

For Gmail, use `smtp.gmail.com` and a Google app password instead of the normal account password.

## Deployment

### Render

The root `render.yaml` is ready for a Render web service. Connect the repository, choose the blueprint, and add the values marked `sync: false`, including MongoDB, JWT, Stripe, Cloudinary, publishable Stripe, and SMTP settings.

### Vercel

Use the repository root as the project root. The root `vercel.json` builds the Vite client and publishes `client/dist`. Set `VITE_API_URL` to the deployed Render API URL followed by `/api`, and set `VITE_STRIPE_PUBLISHABLE_KEY` to the Stripe test publishable key.
