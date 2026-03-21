import os
from pathlib import Path
from string import Template

from api.llm.client import LLMClient
from api.llm.schemas import RequestedExercise, SuggestedExercise
from api.utils import read_markdown_file
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
API_KEY = os.getenv("API_KEY")


BASE_DIR = Path(__file__).parent
CREATE_EXERCISE_SYSTEM = read_markdown_file(BASE_DIR / "llm/prompts/system/create_exercise.md")
CREATE_EXERCISE_USER = read_markdown_file(BASE_DIR / "llm/prompts/user/create_exercise.md")

app = FastAPI()


@app.post("/api/create-exercise")
def create_exercise(exercise: RequestedExercise):
    llm_client = LLMClient(model="gpt-5.1-codex-mini", api_key=API_KEY)

    create_exercise_user = Template(CREATE_EXERCISE_USER).safe_substitute(exercise.model_dump())

    messages = [
        {"role": "system", "content": CREATE_EXERCISE_SYSTEM},
        {"role": "user", "content": create_exercise_user},
    ]

    response = llm_client.llm_response_json(messages)
    suggested_exercise = SuggestedExercise(**response)

    return {
        "title": suggested_exercise.title,
        "description": suggested_exercise.statement,
    }
