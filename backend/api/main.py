from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Exercise(BaseModel):
    description: str
    dificulty: str


@app.post("/api/create-exercise")
def create_exercise(exercise: Exercise):
    title = f"Ejercicio de {exercise.description} — nivel {exercise.dificulty}"
    description = f"Se va a generar un ejercicio del nivel {exercise.dificulty} y sobre {exercise.description}."
    return {"title": title, "description": description}
