# EaseWork Setup Guide

## Backend (Server)

1. Open a terminal and navigate to the server directory:

   ```sh
   cd server
   ```

2. Create and activate a Python virtual environment:

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required dependencies:

   ```sh
   pip install -r requirements.txt
   ```

4. Start the FastAPI server with Uvicorn:
   ```sh
   uvicorn main:app --reload
   ```

## Frontend (Client)

1. Open a new terminal and navigate to the client directory:

   ```sh
   cd client
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:8000](http://localhost:8000) by default.

---

## Troubleshooting

- If you see CORS errors, ensure you are using the `/api` prefix for all frontend API calls and that the Next.js proxy is configured.
- If you get 401 errors, make sure you are logged in and the token is present in localStorage.
- If you change backend or frontend ports, update the proxy in `client/next.config.ts` accordingly.
