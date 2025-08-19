# Python FastAPI Backend with MongoDB

## Setup

1. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and update `MONGODB_URI` if needed:

   ```
   cp .env.example .env
   ```

3. Start the server:
   ```
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /` — Health check
- `POST /items` — Insert a document (JSON body)
- `GET /items` — List all documents
