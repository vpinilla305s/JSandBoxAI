from pydantic import BaseModel, field_validator


class RequestedExercise(BaseModel):
    description: str
    level: str


class SuggestedExercise(BaseModel):
    title: str
    statement: str
    hints: list[str]
    requirements: list[str]

    @field_validator(
        "requirements",
        "hints",
        mode="after",
    )
    @classmethod
    def validate_list_items(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value]

        if any(not item for item in cleaned):
            raise ValueError("Lists cannot contain empty elements.")

        return cleaned


class SubmittedSolution(BaseModel):
    html: str
    css: str
    js: str
    statement: str
    requirements: list[str]


class CorrectedExercise(BaseModel):
    passed: bool
    summary: str
    unmet_requirements: list[str]
    feedback: str
