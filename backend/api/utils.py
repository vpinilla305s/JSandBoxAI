def read_markdown_file(file_path: str) -> str:
    """Reads and returns the content of a Markdown file."""
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()
