from pydantic_settings import BaseSettings
from typing import List
from pydantic import ConfigDict
from pathlib import Path

# Get the directory where this config file is located
BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    model_config = ConfigDict(
        extra='ignore',
        env_file=str(BASE_DIR / '.env'),
        case_sensitive=False
    )
    
    # Database
    database_url: str = "postgresql://user:password@localhost/mineguard"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # Blockchain
    ethereum_rpc_url: str = "http://localhost:8545"
    chain_id: int = 1337
    contract_address: str = ""
    admin_private_key: str = ""

    # Pinata / IPFS
    pinata_api_key: str = ""
    pinata_secret_key: str = ""
    pinata_jwt: str = ""
    
    # Server
    host: str = "0.0.0.0"
    port: int = 3000
    debug: bool = True
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:19006",
        "http://localhost:3000",
        "http://localhost:5173",
    ]

settings = Settings()