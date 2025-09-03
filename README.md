# Notes App

A simple Notes application with CRUD operations and sharing functionality.

## Features

- Create, read, update, and delete notes
- Share notes via unique URLs
- Clean and simple user interface

## Technology Stack

- Frontend: React
- Backend: FastAPI
- Database: SQLite (development)
- Deployment: Vercel

## Local Development

### Backend
1. Navigate to backend folder: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn main:app --reload`

### Frontend
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Deployment

The app is configured for deployment on Vercel.
my deployed notes-app -- https://notes-cvcnn007l-ekrar-raza-khans-projects.vercel.app/
