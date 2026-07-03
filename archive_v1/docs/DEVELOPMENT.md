# Development Guide

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd my_music_page

# Install Python dependencies
make install

# Start development server
make serve

# In another terminal, run validations
make validate
```

## Project Structure

```
my_music_page/
├── assets/               # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Images
│   └── data/            # Data files (JSON)
├── config/              # Configuration files
│   └── site.json        # Site configuration
├── data/                # Additional data
├── docs/                # Documentation
│   └── ARCHITECTURE.md  # Architecture decisions
├── tools/               # Development tools (Python)
│   ├── validate_html.py # HTML validator
│   ├── validate_json.py # JSON validator
│   ├── dev_server.py    # Development server
│   ├── build.py         # Build orchestrator
│   ├── setup_hooks.py   # Git hooks installer
│   ├── env_manager.py   # Environment manager
│   └── config.py        # Configuration loader
├── netlify/             # Netlify functions
├── .env.example         # Environment template
├── .eslintrc.json       # ESLint config
├── .editorconfig        # Editor config
├── .gitignore           # Git ignore rules
├── Makefile             # Build automation
├── requirements.txt     # Python dependencies
├── CONTRIBUTING.md      # Contribution guidelines
├── README.md            # Project readme
└── index.html           # Main HTML file
```

## Development Workflow

### 1. Initial Setup

```bash
# Install dependencies
make install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
vim .env

# Install git hooks (optional)
make hooks
```

### 2. Daily Development

```bash
# Start development server
make serve

# Access site at http://localhost:8000
```

### 3. Making Changes

```bash
# Create feature branch
git checkout -b <category>/<feature-name>

# Make atomic changes
# ... edit files ...
git add <files>
git commit -m "<type>: <description>"

# Validate changes
make validate

# Continue with more atomic commits
```

### 4. Before Committing

```bash
# Run all validators
make validate

# Run full build
make build

# Fix any errors before committing
```

### 5. Submitting Changes

```bash
# Push branch
git push origin <branch-name>

# Create Pull Request on GitHub
# Follow PR template
```

## Available Commands

### Make Commands

```bash
make help      # Show all commands
make install   # Install dependencies
make validate  # Run validators
make build     # Full build process
make serve     # Start dev server
make hooks     # Install git hooks
make test      # Run tests
make clean     # Clean temp files
```

### Python Tools

```bash
# HTML validation
python3 tools/validate_html.py .

# JSON validation
python3 tools/validate_json.py .

# Development server
python3 tools/dev_server.py 8000

# Full build
python3 tools/build.py

# Environment status
python3 tools/env_manager.py

# Install hooks
python3 tools/setup_hooks.py
```

## Configuration

### Environment Variables

Edit `.env` file:

```bash
ENVIRONMENT=development
ADMIN_KEY=your_secure_key
SITE_URL=https://hasanarthuraltuntas.com.tr
DEV_PORT=8000
ENABLE_ANALYTICS=false
ENABLE_DEBUG_MODE=true
```

### Site Configuration

Edit `config/site.json`:

```json
{
  "site": {
    "name": "Portfolio Name",
    "url": "https://your-site.com"
  },
  "features": {
    "darkMode": true,
    "analytics": false
  }
}
```

## Development Standards

### Branch Naming

Format: `<category>/<topic-name>`

Categories:
- `tooling/` - Development tools
- `config/` - Configuration
- `quality/` - Code quality
- `architecture/` - Structure
- `security/` - Security
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation

Examples:
```
tooling/python-infrastructure
config/environment-separation
quality/linting-standards
fix/json-syntax-error
docs/architecture-decisions
```

### Commit Messages

Format: `<type>: <description>`

Types:
- `tooling:` - Development tools
- `config:` - Configuration
- `validation:` - Validation logic
- `automation:` - Automation
- `quality:` - Code quality
- `security:` - Security
- `fix:` - Bug fixes
- `refactor:` - Code restructuring
- `docs:` - Documentation
- `merge:` - Branch merges

Examples:
```
tooling: add python html validator
config: extract site configuration
fix: correct json syntax error
docs: add architecture decisions
```

### Code Style

#### JavaScript

- Use ESLint configuration
- ES2021+ features
- const/let, never var
- Single quotes for strings
- Semicolons required
- 4-space indentation

#### Python

- Follow PEP 8
- Type hints recommended
- Docstrings for functions
- 4-space indentation
- Max line length: 100

#### HTML/CSS

- Semantic HTML5
- Valid syntax
- Accessibility (WCAG)
- Mobile-first responsive
- 4-space indentation

## Testing

### Manual Testing

```bash
# Start server
make serve

# Test in browser
# - http://localhost:8000
# - Test all features
# - Check mobile responsive
# - Verify all links
```

### Automated Validation

```bash
# HTML validation
make validate

# Or individual validators
python3 tools/validate_html.py .
python3 tools/validate_json.py .
```

## Troubleshooting

### Python Not Found

```bash
# Install Python 3.7+
# Ubuntu/Debian
sudo apt install python3 python3-pip

# macOS
brew install python3

# Windows
# Download from python.org
```

### Dependencies Not Installing

```bash
# Upgrade pip
python3 -m pip install --upgrade pip

# Install with verbose output
pip install -v -r requirements.txt
```

### Validation Errors

```bash
# Read error messages carefully
# Fix one error at a time
# Re-run validation

# HTML errors
python3 tools/validate_html.py .

# JSON errors
python3 tools/validate_json.py .
```

### Development Server Issues

```bash
# Check if port is in use
lsof -i :8000

# Use different port
python3 tools/dev_server.py 8001

# Or with make
DEV_PORT=8001 make serve
```

### Git Hooks Not Working

```bash
# Reinstall hooks
python3 tools/setup_hooks.py

# Check hook permissions
ls -la .git/hooks/pre-commit

# Should be executable (-rwxr-xr-x)
```

## Best Practices

### 1. Commit Often

- Make small, atomic commits
- Commit after each logical change
- Don't batch multiple changes

### 2. Validate Early

- Run validators after changes
- Fix errors immediately
- Don't accumulate technical debt

### 3. Document Changes

- Clear commit messages
- Update documentation
- Add comments for complex logic

### 4. Test Locally

- Test before committing
- Verify in browser
- Check mobile responsive

### 5. Keep It Simple

- Prefer clarity over cleverness
- Avoid over-engineering
- Focus on maintainability

## Resources

### Documentation

- [README.md](../README.md) - Project overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture decisions
- [tools/README.md](../tools/README.md) - Tools documentation

### External Resources

- [Python.org](https://www.python.org/) - Python documentation
- [MDN Web Docs](https://developer.mozilla.org/) - Web development
- [ESLint](https://eslint.org/) - JavaScript linting
- [Git](https://git-scm.com/doc) - Git documentation

## Getting Help

### Issues

1. Check documentation first
2. Search existing issues
3. Create detailed issue report
4. Include error messages
5. Describe steps to reproduce

### Questions

- Read CONTRIBUTING.md
- Check ARCHITECTURE.md
- Review existing PRs
- Ask in PR comments

---

Happy coding! 🎵
