# Development Tools

Python-based development tooling for the my_music_page repository.

## Setup

Install dependencies:

```bash
pip install -r requirements.txt
```

## Tools

### 1. HTML Validator

Validates HTML files for syntax errors and structural issues.

```bash
python3 tools/validate_html.py .
```

Features:
- Tag matching validation
- Self-closing tag detection
- Unclosed tag detection
- Comprehensive error reporting

### 2. JSON Validator

Validates JSON data files for syntax correctness.

```bash
python3 tools/validate_json.py .
```

Features:
- JSON syntax validation
- UTF-8 encoding support
- Detailed error messages

### 3. Development Server

Local HTTP server for testing.

```bash
python3 tools/dev_server.py 8000
```

Features:
- CORS headers for development
- Cache control headers
- Custom logging
- Configurable port

### 4. Build Tool

Automated build and validation orchestrator.

```bash
python3 tools/build.py
```

Features:
- Runs all validators
- Generates build report
- Exit codes for CI/CD
- Timestamp tracking

### 5. Pre-commit Hooks

Installs git hooks for automatic validation.

```bash
# Install hooks
python3 tools/setup_hooks.py

# Uninstall hooks
python3 tools/setup_hooks.py uninstall
```

Features:
- Automatic validation before commits
- Prevents broken code from being committed
- Easy installation and removal

### 6. Configuration Manager

Environment-based configuration management.

```python
from tools.config import load_config

config = load_config()
port = config.get('server.port', 8000)
```

Features:
- Default configuration
- Environment-specific overrides
- Dot notation access
- JSON file support

## Integration with Development Workflow

### Daily Development

```bash
# Start development server
python3 tools/dev_server.py

# In another terminal, run validations
python3 tools/build.py
```

### Before Committing

```bash
# Install pre-commit hooks (once)
python3 tools/setup_hooks.py

# Hooks will now run automatically on commit
git commit -m "your message"
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Validate
  run: |
    pip install -r requirements.txt
    python3 tools/build.py
```

## Python-First Approach

These tools demonstrate the Python-first development philosophy:

1. **Validation**: Python for all validation tasks
2. **Automation**: Python-based build orchestration
3. **Configuration**: Python configuration management
4. **Tooling**: Python development server

## Requirements

- Python 3.7+
- Dependencies listed in requirements.txt

## Contributing

When adding new tools:
- Follow Python best practices
- Add docstrings to all functions
- Include usage examples
- Update this README
