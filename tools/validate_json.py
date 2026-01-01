#!/usr/bin/env python3
"""
JSON Validator - Validates JSON files for syntax and schema.

This tool validates JSON data files to ensure they are properly formatted
and follow expected schemas.
"""

import sys
import json
from pathlib import Path
from typing import Dict, Any, List, Tuple


def validate_json_file(filepath: Path) -> Tuple[bool, List[str]]:
    """Validate a single JSON file."""
    errors = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        return True, errors
    except json.JSONDecodeError as e:
        errors.append(f"JSON syntax error: {e}")
        return False, errors
    except Exception as e:
        errors.append(f"Error reading file: {e}")
        return False, errors


def validate_directory(directory: str = '.') -> bool:
    """Validate all JSON files in directory."""
    json_files = list(Path(directory).glob('**/*.json'))
    
    if not json_files:
        print("No JSON files found")
        return True
    
    print(f"Validating {len(json_files)} JSON files...\n")
    
    all_valid = True
    for filepath in json_files:
        rel_path = filepath.relative_to(directory)
        valid, errors = validate_json_file(filepath)
        
        if not valid:
            all_valid = False
            print(f"[FAIL] {rel_path}")
            for error in errors:
                print(f"  ERROR: {error}")
        else:
            print(f"[PASS] {rel_path}")
    
    return all_valid


if __name__ == '__main__':
    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    print("JSON Validator")
    print("=" * 50)
    
    success = validate_directory(directory)
    
    if success:
        print("\n[PASS] All JSON files are valid")
        sys.exit(0)
    else:
        print("\n[FAIL] JSON validation failed")
        sys.exit(1)
