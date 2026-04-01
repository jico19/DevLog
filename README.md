# React-Django Template with Simple JWT

This is a simple starter template combining Django (backend) and React (frontend) with Simple JWT authentication. Follow the steps below to get it running:

# Backend setup
cd backend/
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup
cd ../frontend/
npm install
npm start

Your application should now be running with the backend on `http://127.0.0.1:8000/` and the frontend on `http://localhost:5173/`.

Project structure:

project-root/
backend/
  manage.py
  app/
  requirements.txt
frontend/
  package.json
  src/

Notes:
- Backend uses Simple JWT for authentication.
- Default database is SQLite (db.sqlite3), configurable in settings.py.
- Static and media files are ignored in .gitignore.
- Store sensitive keys in a .env file and include it in .gitignore.
