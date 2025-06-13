# Paper Trail

Paper Trail is a personal note-taking web application that helps you keep track of your thoughts, ideas, and important information all in one place.

## Features

- Create, view, and manage notes
- Light and dark mode toggle
- Responsive and modern UI
- User authentication
- Dashboard overview
- PostgreSQL database backend
- RESTful API with FastAPI
- Frontend built with React and Vite
- Dockerized for easy development

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Authentication:** Custom (expand as needed)
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- (For local dev) [Node.js](https://nodejs.org/) and [Python 3.12+](https://www.python.org/)

### Development Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/paper-trail.git
   cd paper-trail
   ```

2. **Start with Docker Compose:**

   ```sh
   docker-compose up --build
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)
   - PostgreSQL: exposed on port 5432 (see `docker-compose.yml`)

3. **Local Development (without Docker):**

   - **Backend:**

     ```sh
     cd backend
     pip install -r requirements.txt
     uvicorn app.main:app --reload
     ```

   - **Frontend:**
     ```sh
     cd frontend
     npm install
     npm run dev
     ```

## Environment Variables

- Backend: Set `DATABASE_URL` in your environment or `.env` file (see `docker-compose.yml` for example).
- Frontend: Configure API endpoint if needed.

## Database Migrations

For schema changes, use [Alembic](https://alembic.sqlalchemy.org/) or drop/recreate the database in development.

## Testing

- **Backend:**
  ```sh
  cd backend
  pytest
  ```
- **Frontend:**
  ```sh
  cd frontend
  npm test
  ```

## Project Structure

```
Paper-Trail/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

## License

Built by Rasheem & Kofi.
