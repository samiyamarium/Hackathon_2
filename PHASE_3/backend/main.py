from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agents import create_todo_agent

# --------------------------------------------------
# App setup
# --------------------------------------------------
app = FastAPI(
    title="Hackathon Phase 3 Backend",
    version="1.0.0"
)

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Initialize LangChain Agent (ONCE)
# --------------------------------------------------
todo_agent = create_todo_agent()

# --------------------------------------------------
# Health check
# --------------------------------------------------
@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

# --------------------------------------------------
# Agent endpoint
# --------------------------------------------------
@app.post("/agent")
def run_agent(prompt: str):
    """
    Run LangChain agent with user prompt
    """
    result = todo_agent.invoke({"input": prompt})
    return {
        "prompt": prompt,
        "response": result["output"]
    }
