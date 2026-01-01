from dataclasses import dataclass, field

@dataclass
class Todo:
    id: int
    description: str
    completed: bool = field(default=False)

    def __post_init__(self):
        if not self.description or not self.description.strip():
            raise ValueError("Description cannot be empty.")
