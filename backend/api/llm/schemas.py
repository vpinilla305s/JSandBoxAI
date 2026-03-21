from pydantic import BaseModel, field_validator


class RequestedExercise(BaseModel):
    description: str
    level: str


class SuggestedExercise(BaseModel):
    title: str
    topic: str
    learning_objectives: list[str]
    statement: str
    requirements: list[str]
    validation_criteria: list[str]
    hints: list[str]

    @field_validator(
        "learning_objectives",
        "requirements",
        "validation_criteria",
        "hints",
        mode="after",
    )
    @classmethod
    def validate_list_items(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value]

        if any(not item for item in cleaned):
            raise ValueError("Las listas no pueden contener elementos vacíos.")

        return cleaned

    # @model_validator(mode="after")
    # def validate_global_consistency(self):
    #     if len(self.validation_criteria) < len(self.requirements):
    #         raise ValueError(
    #             "Debe haber al menos tantos validation_criteria como requirements."
    #         )
    #     return self
