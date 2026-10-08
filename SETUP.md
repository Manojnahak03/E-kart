# ManojMart - College Project

## 1. Backend
1. Open `backend/.env`.
2. Put your MongoDB Atlas URI, mail credentials and a long `SECRET_KEY`.
3. Set your own `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
4. `cd backend && npm install && npm start`

On startup, the server creates/updates the configured admin account with `role: admin` and `isVerified: true`. Normal signup always creates `role: user`.

## 2. Frontend
`cd frontend && npm install && npm run dev`

For deployment, set `VITE_API_URL` to the deployed backend API URL, for example `https://your-backend.onrender.com/api/v1`.

## 3. Admin security
- `/admin` is shown only to logged-in admins.
- Direct `/admin` navigation by a normal user redirects to login.
- Product create/update/delete and admin order APIs require `isAuthenticated + isAdmin`.
- Admin login is a UI mode, but the backend still verifies that the account actually has `role: admin`.

## 4. Payment
The checkout contains clearly-labelled demo UPI, demo QR and demo card flows for college presentation. They do not move real money. Razorpay test integration remains available in the backend if test credentials are configured. Razorpay sandbox can simulate payment outcomes; it is not a substitute for real-money payment in this college demo.
