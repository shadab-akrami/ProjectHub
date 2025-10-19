from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/project_management"
    SECRET_KEY: str = "dev-secret-key"

    class Config:
        env_file = ".env"

settings = Settings()
