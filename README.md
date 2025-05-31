# Charging Station App

## Overview
A full-stack application built with Node.js, Express, and MongoDB for managing charging stations. Includes user authentication (register/login) and CRUD operations for charging stations.

## Project Structure
- `backend/`: Node.js & Express backend with API routes for auth and charging stations.
- `.gitignore`: Ignores `node_modules/`, `.env`, and other unnecessary files.
- `LICENSE`: MIT License.

## Setup Instructions(Backend)
1. Clone the repository: `git clone https://github.com/kivishdev/charging-station-app.git`
2. Navigate to the backend folder: `cd charging-station-app/backend`
3. Install dependencies: `npm install`
4. Create a `.env` file in the backend folder with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/charging_station_db
JWT_SECRET=your_jwt_secret_key

5. Start the MongoDB server (e.g., run `mongod`).
6. Start the backend server: `npm run dev`
7. Test APIs using Postman (e.g., `POST /api/auth/register`, `POST /api/stations`).


### Setup Instructions(Frontend)
1. Navigate to the frontend folder: `cd charging-station-app/frontend`
2. Install dependencies: `npm install`
3. Start the frontend server: `npm run dev`
4. Open `http://localhost:5173` in your browser to access the app.
5. Log in with an existing user (e.g., `test@example.com` with password `password123`) or register a new user via Postman.

## Day 1 Progress
- [x] Backend setup with Node.js, Express, and MongoDB.
- [x] User authentication APIs (register, login).
- [x] Charging station CRUD APIs (create, read, update, delete).

## Day 2 Progress
- [x] Vue.js frontend setup with Vite and Vue Router (local setup).
- [x] Login page with authentication (connects to backend `/api/auth/login`).
- [x] Chargers page to list charging stations (connects to backend `/api/stations`).