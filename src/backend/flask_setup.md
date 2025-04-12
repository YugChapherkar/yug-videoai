# Flask Backend Setup for VideoAI

This document outlines how to set up a Flask backend for the VideoAI application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment tool (venv or conda)

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (not in version control)
├── models/                # Database models
│   ├── __init__.py
│   ├── user.py
│   ├── video.py
│   └── clip.py
├── routes/                # API routes
│   ├── __init__.py
│   ├── auth.py
│   ├── videos.py
│   └── clips.py
├── services/              # Business logic
│   ├── __init__.py
│   ├── auth_service.py
│   ├── video_service.py
│   └── clip_service.py
└── utils/                 # Utility functions
    ├── __init__.py
    ├── validators.py
    └── helpers.py
```

## Setup Instructions

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install flask flask-cors flask-sqlalchemy flask-jwt-extended python-dotenv opencv-python moviepy tensorflow
```

3. Create a requirements.txt file:

```bash
pip freeze > requirements.txt
```

4. Create a .env file with the following variables:

```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URI=sqlite:///videoai.db
JWT_SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

5. Create the main app.py file:

```python
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes import register_routes
from models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": app.config['ALLOWED_ORIGINS']}})
    JWTManager(app)
    db.init_app(app)
    
    # Register routes
    register_routes(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
```

6. Create a config.py file:

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///videoai.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key')
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500 MB max upload size
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

### Videos

- `GET /api/videos` - Get all videos for the authenticated user
- `POST /api/videos` - Upload a new video
- `GET /api/videos/<video_id>` - Get a specific video
- `DELETE /api/videos/<video_id>` - Delete a video

### Clips

- `POST /api/clips/generate` - Generate clips from a video
- `GET /api/clips` - Get all generated clips
- `GET /api/clips/<clip_id>` - Get a specific clip
- `DELETE /api/clips/<clip_id>` - Delete a clip

### Captions

- `POST /api/captions` - Save captions for a video/clip
- `GET /api/captions/<video_id>` - Get captions for a video/clip

## AI Clip Generation Implementation

The AI clip generation service would use a combination of:

1. **OpenCV** for video processing and frame analysis
2. **MoviePy** for video editing and clip creation
3. **TensorFlow** for AI models to detect:
   - Faces and emotions
   - Action sequences
   - Key moments based on audio/visual cues

The implementation would involve:

1. Analyzing the video to identify potential clip segments
2. Scoring segments based on engagement potential
3. Cutting the top-scoring segments into clips
4. Optimizing each clip for the target platform (aspect ratio, duration)
5. Adding captions and effects as requested

## Running the Backend

```bash
flask run
```

Or with gunicorn for production:

```bash
gunicorn app:app
```

## Connecting to the Frontend

Update the API base URL in the frontend to point to your Flask backend:

```typescript
// src/lib/api.ts
const API_BASE_URL = 'http://localhost:5000/api';
```

This setup provides a solid foundation for building the backend services needed for the VideoAI application, including the AI-powered clip generation feature.
