# Todo AI Chatbot

This project implements an AI-powered chatbot for managing todo tasks through natural language, built using a FastAPI backend, OpenAI Agents SDK, MCP (Model Context Protocol) server architecture, and a Next.js (ChatKit) frontend.

## Project Structure

- `frontend/`: Next.js application for the chatbot UI (OpenAI ChatKit).
- `backend/`: FastAPI application that serves the chat endpoint, integrates with the OpenAI Agents SDK, and exposes task operations via an MCP server.
- `specs/`: Specification files for the AI agent behavior and MCP tools.

## Technology Stack

- **Frontend:** OpenAI ChatKit (Next.js)
- **Backend:** Python FastAPI
- **AI Framework:** OpenAI Agents SDK
- **MCP Server:** Official MCP SDK (`fastapi-mcp`)
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** Better Auth (JWT-based)

## Setup Instructions

Follow these steps to set up and run the project locally.

### 1. Database Setup (Neon Serverless PostgreSQL)

1.  **Create a Neon Project:** Go to [Neon](https://neon.tech/) and create a new project.
2.  **Get Connection String:** From your Neon project dashboard, obtain the PostgreSQL connection string. It should look something like:
    `postgresql://user:password@ep-weathered-mouse-aikwdvso-pooler.c-4.us-east-1.aws.neon.tech/todo_app_3?sslmode=require&channel_binding=require`
3.  **Environment Variable:** You will use this connection string in the `backend/.env` file.

### 2. Backend Setup

1.  **Navigate to Backend Directory:**
    ```bash
    cd backend
    ```
2.  **Create Virtual Environment (if not already present):**
    ```bash
    python -m venv venv
    ```
3.  **Activate Virtual Environment:**
    -   **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    -   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Create `.env` File:** In the `backend/` directory, create a file named `.env` and add the following content. Replace the placeholder values with your actual keys and connection string.
    ```env
    DATABASE_URL="YOUR_NEON_POSTGRES_CONNECTION_STRING"
    SECRET_KEY="A_STRONG_RANDOM_SECRET_KEY" # Used for JWT authentication
    GROQ_API_KEY="YOUR_GROQ_API_KEY" # Get this from Groq Console
    ```
    -   **`DATABASE_URL`**: Your Neon PostgreSQL connection string.
    -   **`SECRET_KEY`**: A strong, random string for JWT token encryption.
    -   **`GROQ_API_KEY`**: Your API key from the [Groq Console](https://console.groq.com/).

6.  **Run Database Migrations:**
    ```bash
    ./venv/Scripts/alembic.exe upgrade head
    ```
    This will apply all pending database migrations and create the necessary tables (Task, Conversation, Message, User).

7.  **Run the Backend Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will be available at `http://127.0.0.1:8000`. You can test the API endpoints using tools like Swagger UI (available at `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup

1.  **Navigate to Frontend Directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install Node.js Dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
3.  **Configure ChatKit Domain Allowlist (for hosted ChatKit):**
    If you plan to deploy your frontend, you need to add its domain to OpenAI's allowlist.
    -   Deploy your frontend first to get a production URL (e.g., Vercel, GitHub Pages).
    -   Go to `https://platform.openai.com/settings/organization/security/domain-allowlist`.
    -   Add your deployed frontend URL.
    -   Obtain your ChatKit domain key.

4.  **Create `.env.local` File:** In the `frontend/` directory, create a file named `.env.local` and add the following content.
    ```env
    NEXT_PUBLIC_BACKEND_URL="http://localhost:8000" # Or your deployed backend URL
    NEXT_PUBLIC_OPENAI_DOMAIN_KEY="YOUR_CHATKIT_DOMAIN_KEY" # Only needed for hosted ChatKit
    ```
    -   **`NEXT_PUBLIC_BACKEND_URL`**: The URL where your FastAPI backend is running.
    -   **`NEXT_PUBLIC_OPENAI_DOMAIN_KEY`**: Your domain key from OpenAI's ChatKit domain allowlist (if using hosted ChatKit).

5.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    The frontend will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Usage

1.  **Register a User:** Before using the chat, you'll need to register a user. You can do this via the `/register` endpoint on the backend (e.g., using Swagger UI at `http://127.0.0.1:8000/docs`).
2.  **Login and Obtain Token:** After registering, log in via the `/token` endpoint to get an access token. This token will be used by the frontend for authentication.
3.  **Start Chatting:** Open the frontend application in your browser. The ChatKit UI will interact with your backend, allowing you to manage your todo tasks using natural language.

Enjoy your AI Todo Chatbot!
