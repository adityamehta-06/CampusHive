# CampusHive setup

CampusHive has a React frontend in `CampusHive/` and an Express/MongoDB API in `server/`.

## Run locally

1. Install and start MongoDB locally, or create a free MongoDB Atlas database.
2. Create `server/.env` with `PORT=5000`, `MONGODB_URI=mongodb://127.0.0.1:27017`, a long `JWT_SECRET` and `CLIENT_URL=http://localhost:5173`. The app uses the `campushive` database (you can see it in MongoDB Compass).
3. In two terminals, run:

```bash
cd CampusHive-updated/server
npm install
npm run dev
```

```bash
cd CampusHive-updated/CampusHive
npm run dev
```

The frontend expects the API at `http://localhost:5000/api` (set in `CampusHive/src/services/api.js`).

## Implemented API

- Account registration, login, and JWT sessions
- Persistent resource listings with resource-owner permissions
- Borrow requests, owner approval/rejection, and borrower returns
- Resource catalogue and details screens fetching the API
