Docker Compose Setup – Explanation:

This file defines three services (Postgres database, Backend API, and Frontend dashboard) and how they connect with each other inside a single Docker network.

-> version: "3.9"
   Defines the Docker Compose file format.
   Version 3.9 works with the latest Docker Engine and Compose V2.
======================================================================================================================================================================
-> Services
1. Database Service – db
  db:
    image: postgres:17
    container_name: postgres17
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data


- image: postgres:17 → Official PostgreSQL version 17.
- container_name: postgres17 → Gives the container a fixed name.
- restart: always → Restarts automatically if it crashes.
- environment → Database credentials & name (taken from .env file):
   POSTGRES_USER = username.
   POSTGRES_PASSWORD = password.
   POSTGRES_DB = initial database created.
- ports: "5433:5432" → Makes Postgres accessible on localhost:5433 (host) mapped to 5432 inside the container.
- volumes → Mounts persistent storage postgres_data so data isn’t lost when container restarts.

 This service provides the PostgreSQL database.
=======================================================================================================================================================

2. Backend Service – backend
  backend:
    build: ./Backend
    container_name: backend
    restart: always
    env_file:
      - .env
    environment:
      DB_HOST: db
      DB_USER: ${POSTGRES_USER}
      DB_PASS: ${POSTGRES_PASSWORD}
      DB_NAME: ${POSTGRES_DB}
      DB_PORT: 5432
      NODE_ENV: ${NODE_ENV}
      PORT: ${PORT}
      DATABASE_URL: ${DATABASE_URL}
      LOG_DIR: ${LOG_DIR}
    depends_on:
      - db
    ports:
      - "4000:4000"
    volumes:
      - ./Backend:/app

- build: ./Backend → Builds image from Backend/Dockerfile.
- container_name: backend → Names container backend.
- restart: always → Restarts if stopped.
- env_file: .env → Loads common variables from .env.
- environment → Configures backend API:
   DB_HOST: db → Connects to the db service by its service name (Docker internal DNS).
   DB_USER, DB_PASS, DB_NAME → Taken from .env (same as Postgres).
   DB_PORT: 5432 → Internal DB port (not host’s 5433).
   NODE_ENV, PORT, DATABASE_URL, LOG_DIR → Standard Node.js app configs.

- depends_on: db → Ensures DB starts before backend.
- ports: "4000:4000" → Exposes backend on http://localhost:4000
- volumes: ./Backend:/app → Mounts local backend code for development (hot-reload possible).

 This service runs the API that queries the Postgres DB and serves data to the frontend.
====================================================================================================================================

3. Frontend Service – frontend
  frontend:
    build: ./Frontend
    container_name: frontend
    restart: always
    env_file:
      - .env
    environment:
      VITE_APP_API_URL: ${VITE_APP_API_URL}
    depends_on:
       - backend
    ports:
      - "3000:3000"
    volumes:
      - ./Frontend:/app
      - /app/node_modules

- build: ./Frontend → Builds image from Frontend/Dockerfile.
- container_name: frontend → Names container frontend.
- restart: always → Auto restart if it fails.
- env_file: .env → Loads variables from .env.
- environment:
   VITE_APP_API_URL → Frontend will connect to backend API (e.g., http://backend:4000 inside Docker, or http://localhost:4000 outside).
- depends_on: backend → Ensures backend starts before frontend.
- ports: "3000:3000" → Exposes frontend app on http://localhost:3000
- volumes:
   ./Frontend:/app → Mounts frontend code for development.
   /app/node_modules → Ensures node_modules remain inside container only.

This service runs the React frontend dashboard that communicates with the backend API.
=================================================================================================================================================================== 
 
 Volumes:
    volumes:
      postgres_data:

- Named volume postgres_data stores Postgres data persistently.
- Prevents data loss when the container restarts or is rebuilt.
===============================================================================================================================================================
How Containers Communicate:

- Docker Compose creates a default network for all services.
- Services can talk to each other using service names as hostnames.
    Backend → connects to DB at db:5432.
    Frontend → connects to Backend at backend:4000.
- From the host machine:
   Postgres → localhost:5433
   Backend → http://localhost:4000
   Frontend → http://localhost:3000
