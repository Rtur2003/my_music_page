"""
Configuration Management - Environment-based configuration loader.

This module provides centralized configuration management with
environment-specific overrides.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, Optional


class ConfigurationError(Exception):
    """Raised when configuration is invalid or missing."""
    pass


class Configuration:
    """Configuration manager with environment support."""
    
    DEFAULT_CONFIG = {
        'site': {
            'name': 'Hasan Arthur Altuntaş Portfolio',
            'url': 'https://hasanarthuraltuntas.com.tr',
            'description': 'Music Producer & AI Developer Portfolio'
        },
        'server': {
            'port': 8000,
            'host': 'localhost'
        },
        'validation': {
            'html': True,
            'json': True,
            'strict_mode': False
        },
        'build': {
            'minify_css': False,
            'minify_js': False,
            'optimize_images': False
        }
    }
    
    def __init__(self, config_file: Optional[str] = None):
        self.config = self.DEFAULT_CONFIG.copy()
        self.environment = os.getenv('ENVIRONMENT', 'development')
        
        if config_file:
            self.load_from_file(config_file)
        
        self.apply_environment_overrides()
    
    def load_from_file(self, filepath: str):
        """Load configuration from JSON file."""
        path = Path(filepath)
        
        if not path.exists():
            raise ConfigurationError(f"Config file not found: {filepath}")
        
        try:
            with open(path, 'r') as f:
                loaded_config = json.load(f)
                self._merge_config(self.config, loaded_config)
        except json.JSONDecodeError as e:
            raise ConfigurationError(f"Invalid JSON in config file: {e}")
    
    def apply_environment_overrides(self):
        """Apply environment-specific configuration."""
        if self.environment == 'production':
            self.config['build']['minify_css'] = True
            self.config['build']['minify_js'] = True
            self.config['validation']['strict_mode'] = True
    
    def _merge_config(self, base: Dict, override: Dict):
        """Recursively merge configuration dictionaries."""
        for key, value in override.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._merge_config(base[key], value)
            else:
                base[key] = value
    
    def get(self, key_path: str, default: Any = None) -> Any:
        """Get configuration value using dot notation."""
        keys = key_path.split('.')
        value = self.config
        
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        
        return value
    
    def set(self, key_path: str, value: Any):
        """Set configuration value using dot notation."""
        keys = key_path.split('.')
        target = self.config
        
        for key in keys[:-1]:
            if key not in target:
                target[key] = {}
            target = target[key]
        
        target[keys[-1]] = value
    
    def to_dict(self) -> Dict:
        """Export configuration as dictionary."""
        return self.config.copy()
    
    def save_to_file(self, filepath: str):
        """Save configuration to JSON file."""
        with open(filepath, 'w') as f:
            json.dump(self.config, f, indent=2)


def load_config(config_file: Optional[str] = None) -> Configuration:
    """Load configuration with optional custom file."""
    return Configuration(config_file)
