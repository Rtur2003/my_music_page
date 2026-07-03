#!/usr/bin/env python3
"""
Environment Manager - Load and manage environment variables.

This script provides utilities for loading environment variables
from .env files and making them accessible to development tools.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Optional


class EnvironmentManager:
    """Manages environment variables and configuration."""
    
    def __init__(self, env_file: str = '.env'):
        self.env_file = Path(env_file)
        self.variables: Dict[str, str] = {}
        self.load_env()
    
    def load_env(self):
        """Load environment variables from .env file."""
        if not self.env_file.exists():
            print(f"Warning: {self.env_file} not found")
            print(f"Copy .env.example to .env and configure it")
            return
        
        try:
            with open(self.env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    
                    if not line or line.startswith('#'):
                        continue
                    
                    if '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip()
                        
                        value = value.strip('"').strip("'")
                        
                        self.variables[key] = value
                        os.environ[key] = value
            
            print(f"✓ Loaded {len(self.variables)} environment variables")
            
        except Exception as e:
            print(f"Error loading .env file: {e}")
    
    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """Get an environment variable."""
        return os.getenv(key, default)
    
    def set(self, key: str, value: str):
        """Set an environment variable."""
        os.environ[key] = value
        self.variables[key] = value
    
    def get_environment(self) -> str:
        """Get current environment (development, staging, production)."""
        return self.get('ENVIRONMENT', 'development')
    
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.get_environment() == 'development'
    
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.get_environment() == 'production'
    
    def export(self) -> Dict[str, str]:
        """Export all environment variables."""
        return self.variables.copy()
    
    def print_status(self):
        """Print current environment status."""
        print("=" * 50)
        print("Environment Status")
        print("=" * 50)
        print(f"Environment: {self.get_environment()}")
        print(f"Site URL: {self.get('SITE_URL', 'Not set')}")
        print(f"Dev Port: {self.get('DEV_PORT', '8000')}")
        print(f"Analytics: {self.get('ENABLE_ANALYTICS', 'false')}")
        print(f"Debug Mode: {self.get('ENABLE_DEBUG_MODE', 'false')}")
        print("=" * 50)


def load_environment(env_file: str = '.env') -> EnvironmentManager:
    """Load environment configuration."""
    return EnvironmentManager(env_file)


if __name__ == '__main__':
    env_file = sys.argv[1] if len(sys.argv) > 1 else '.env'
    manager = load_environment(env_file)
    manager.print_status()
