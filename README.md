Charging Station App
Overview
The Charging Station App is a full-stack web application built using Node.js, Express, MongoDB, and Vue.js. It allows users to manage electric vehicle charging stations by performing CRUD operations (Create, Read, Update, Delete) and visualizing stations on an interactive map. The app includes user authentication and a map-based location selection feature for adding new stations.
This project is part of a 5-day development sprint, with features being added progressively each day.

Tech Stack

Backend: Node.js, Express, MongoDB (with Mongoose)
Frontend: Vue.js (Vue 3), Vue Router, Axios, Leaflet (for maps), Vue3-Toastify (for notifications)
Styling: Bootstrap (via CDN), Custom CSS
Database: MongoDB (local instance)


## Setup Instructions:
Prerequisites
Node.js (v16 or higher)
MongoDB (local instance running on mongodb://localhost:27017)
Git (to clone the repository)

Installation:
Clone the Repository:
git clone https://github.com/kivishdev/charging-station-app.git
cd charging-station-app


## Backend Setup:

Navigate to the backend directory:
cd backend


Install dependencies:
npm install


Create a .env file in the backend directory with the following content:
MONGODB_URI=mongodb://localhost:27017/chargingstationdb
JWT_SECRET=your_jwt_secret_here

Replace your_jwt_secret_here with a secure secret key for JWT.

Start the backend server:
npm run dev

The backend will run on http://localhost:5000.



## Frontend Setup:
Navigate to the frontend directory:
cd ../frontend

Install dependencies:
npm install

Start the frontend development server:
npm run dev

The frontend will run on http://localhost:5173.

## MongoDB Setup:
Ensure MongoDB is running locally on mongodb://localhost:27017.
The app will automatically create a database named chargingstationdb and a collection named chargingstations upon first use.


Access the App:

Open your browser and go to http://localhost:5173.
Log in with the default user:
Email: test@example.com
Password: password123


Features
Authentication

Login: Users can log in with their email and password. A JWT token is stored in localStorage for session management.
Logout: Users can log out, which clears the JWT token and redirects to the login page.

Charging Station Management

List View:
Displays all charging stations in a table with columns for Name, Location (latitude, longitude), Status, Power Output, Connector Type, and Actions.
Actions include Edit and Delete for each station.


Create Station:
Users can add a new station by filling out a form with fields for Name, Latitude, Longitude, Status, Power Output, and Connector Type.
Frontend validation ensures latitude is between -90 and 90, and longitude is between -180 and 180.


Edit Station:
Users can edit an existing station via a modal form, with the same fields and validation as the create form.


Delete Station:
Users can delete a station with a confirmation prompt.



Map View:
Interactive Map:
Displays all charging stations as markers on a Leaflet map using OpenStreetMap tiles.
Markers include popups with station details (Name, Location, Status, Power Output, Connector Type).
The map initially loads at zoom level 3 (continent view) when there are no stations.
After adding stations, the map centers on the average coordinates of all stations and sets the zoom to level 6 (regional view).


## New
Select Location on Map:
Map-Based Location Selection:
In the create form, users can click a "Select Location on Map" button to switch to the Map View.
Users can click anywhere on the map to place a temporary red marker, and the map zooms to level 10 (street view) at the clicked location.
Clicking "Confirm Location" populates the Latitude and Longitude fields in the create form with the clicked coordinates and switches back to List View.
Users can then fill out the remaining fields and submit the form to create the station.
A "Cancel" button allows users to abort the location selection and return to List View.
Map-selected coordinates bypass frontend validation errors since they are guaranteed to be valid (within -90 to 90 for latitude, -180 to 180 for longitude).



Development Log:
Day 1

Set up the project structure with separate backend and frontend directories.
Implemented the backend API with Express and MongoDB:
Routes for user authentication (/api/auth/login).
Routes for CRUD operations on charging stations (/api/stations).


Added basic user authentication with JWT.

Day 2

Set up the Vue.js frontend with Vue Router.
Implemented the login page and basic navigation.
Created the ChargersView component with List View to display stations in a table.
Added CRUD functionality (Create, Read, Update, Delete) for stations in List View.

Day 3

Added the Map View tab using Leaflet to display stations as markers.
Implemented the "Select Location on Map" feature for creating new stations (see Features section above).
Added frontend validation for latitude and longitude to match backend rules (latitude: -90 to 90, longitude: -180 to 180).
Fixed bugs:
Removed range validator from latitude/longitude inputs (changed to type="text").
Fixed Map View rendering issue on second visit by properly reinitializing the map.

Adjusted Map View zoom levels:
Initial zoom set to 3 (continent view) when the map first loads.
After adding stations, the map zooms to level 6 (regional view) while centering on the markers.


Contributing
This is a personal project for learning purposes. Contributions are not expected, but feel free to fork the repository and experiment!

