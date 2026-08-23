# Mera Store

Mera Store is the Weeks 7-8 capstone implementation from the supplied PDF. It uses the requested MERN stack and keeps the storefront deliberately editorial, fast, and professional.

Repository: https://github.com/ahmedsufian10/MeraStore-E-commerce-store

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

Real secrets belong only in local `.env` files or deployment provider environment settings. They are excluded by `.gitignore` and must never be committed to GitHub.

The integrations are enabled when these values are present:

- MongoDB Atlas: `MONGO_URI`
- Authentication: `JWT_SECRET`
- Stripe: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Nodemailer: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `FROM_EMAIL`

## Email confirmation

Set these values in `server/.env` to enable Nodemailer order confirmations:

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-mailbox@example.com
EMAIL_PASS=your-smtp-password-or-app-password
FROM_EMAIL=Mera Store <your-mailbox@example.com>
```

For Brevo, use `smtp-relay.brevo.com` on port `587`, the SMTP login shown in Brevo, and a Brevo SMTP key. Verify the sender address in Brevo before sending transactional email.

## Deployment

The GitHub repository is ready for deployment. The recommended setup uses Render for the Express API and Vercel for the Vite client.

### Render

The root `render.yaml` is ready for a Render web service. In Render, select New > Blueprint, connect `ahmedsufian10/MeraStore-E-commerce-store`, and add every value marked `sync: false`:

- `CLIENT_URL`: the final Vercel URL
- `MONGO_URI` and `JWT_SECRET`
- `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `FROM_EMAIL`

Render builds with `npm install && npm run build` and starts with `npm start`. Its API URL will look like `https://mera-store-api.onrender.com`.

### Vercel

Import the same GitHub repository. Keep the repository root as the project root. The root `vercel.json` builds the Vite client and publishes `client/dist`. Add these Vercel environment variables:

```env
VITE_API_URL=https://mera-store-api.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_replace_me
```

After Vercel provides its URL, update `CLIENT_URL` in Render and redeploy the API. The frontend and API must use the correct deployed URLs for CORS and API requests.

Deployment status: GitHub is complete. Render and Vercel still require account-side Blueprint and project creation.

