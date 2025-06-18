import os

def create_project_structure():
    # Define the project structure
    project_structure = {
        "netflix-clone": {
            "client": {
                "public": {},
                "src": {
                    "components": {},
                    "context": {},
                    "pages": {},
                    "hooks": {},
                    "services": {},
                    "App.jsx": None
                },
                "package.json": None,
                ".env.local": None
            },
            "server": {
                "src": {
                    "controllers": {},
                    "middleware": {},
                    "models": {},
                    "routes": {},
                    "utils": {}
                },
                "package.json": None,
                ".env": None
            },
            "docker-compose.yml": None,
            ".gitignore": None,
            "README.md": None
        }
    }

    def create_structure(base_path, structure):
        for name, content in structure.items():
            path = os.path.join(base_path, name)
            
            # Create directory
            if isinstance(content, dict):
                os.makedirs(path, exist_ok=True)
                create_structure(path, content)
            # Create file
            else:
                with open(path, 'w') as f:
                    pass  # Create empty file

    # Create base directory and structure
    base_dir = "netflix-clone"
    os.makedirs(base_dir, exist_ok=True)
    create_structure(base_dir, project_structure["netflix-clone"])
    print(f"Project structure created successfully in {base_dir}/")

if __name__ == "__main__":
    create_project_structure()