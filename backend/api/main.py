import os
from pathlib import Path
from string import Template

from api.llm.client import LLMClient
from api.llm.schemas import (
    CorrectedExercise,
    RequestedExercise,
    SubmittedSolution,
    SuggestedExercise,
)
from api.utils import read_markdown_file
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

LLM_MODEL = os.getenv("LLM_MODEL")
API_BASE_URL = os.getenv("API_BASE_URL")
LLM_API_KEY = os.getenv("LLM_API_KEY")
BASE_DIR = Path(__file__).parent

app = FastAPI()


@app.post("/api/create-exercise")
def create_exercise(exercise: RequestedExercise):
    CREATE_EXERCISE_SYSTEM = read_markdown_file(BASE_DIR / "llm/prompts/system/create_exercise.md")
    CREATE_EXERCISE_USER = read_markdown_file(BASE_DIR / "llm/prompts/user/create_exercise.md")

    llm_client = LLMClient(model=LLM_MODEL, api_base=API_BASE_URL, api_key=LLM_API_KEY)

    create_exercise_user = Template(CREATE_EXERCISE_USER).safe_substitute(exercise.model_dump())

    messages = [
        {"role": "system", "content": CREATE_EXERCISE_SYSTEM},
        {"role": "user", "content": create_exercise_user},
    ]

    response = llm_client.llm_response_json(messages)
    suggested_exercise = SuggestedExercise(**response)

    return suggested_exercise


@app.post("/api/correct-exercise")
def correct_exercise(solution: SubmittedSolution):
    CORRECT_EXERCISE_SYSTEM = read_markdown_file(BASE_DIR / "llm/prompts/system/correct_exercise.md")
    CORRECT_EXERCISE_USER = read_markdown_file(BASE_DIR / "llm/prompts/user/correct_exercise.md")

    llm_client = LLMClient(model=LLM_MODEL, api_base=API_BASE_URL, api_key=LLM_API_KEY)

    correct_exercise_user = Template(CORRECT_EXERCISE_USER).safe_substitute(solution.model_dump())

    messages = [
        {"role": "system", "content": CORRECT_EXERCISE_SYSTEM},
        {"role": "user", "content": correct_exercise_user},
    ]

    response = llm_client.llm_response_json(messages)
    corrected_exercise = CorrectedExercise(**response)

    return corrected_exercise
