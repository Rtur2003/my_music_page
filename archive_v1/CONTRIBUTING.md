# Contributing Guidelines

## Development Philosophy

This project follows **Python-first** development principles with strict quality standards.

## Branch Strategy

### Branching Rules

1. **Never commit directly to `main`**
2. Create topic-based branches: `<category>/<topic-name>`
3. One branch = one concern = one PR

### Branch Categories

- `tooling/` - Development tools and automation
- `config/` - Configuration management
- `quality/` - Code quality improvements
- `architecture/` - Structural changes
- `security/` - Security enhancements
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates

### Examples

```
tooling/python-infrastructure
config/environment-separation
quality/linting-standards
architecture/modular-structure
security/input-validation
```

## Commit Discipline

### Atomic Commits

Each commit must represent:
- One logical change
- One responsibility
- One unit of work

### Commit Message Format

```
<type>: <description>

Examples:
tooling: add python html validator
config: extract site configuration to json
quality: add eslint configuration
fix: correct json syntax in music data
docs: update readme with python tooling
```

### Commit Types

- `tooling:` - Development tools
- `config:` - Configuration changes
- `validation:` - Validation logic
- `automation:` - Automated processes
- `quality:` - Code quality improvements
- `security:` - Security fixes
- `fix:` - Bug fixes
- `refactor:` - Code restructuring
- `docs:` - Documentation
- `merge:` - Branch merges

### Forbidden Commits

- Multiple unrelated changes in one commit
- "misc", "minor fixes", "cleanup" messages
- Mixing refactor + behavior change
- Batched/squashed logic

## Python-First Priority

### Default Language

Python is the primary language for:
- Tooling and automation
- Validation scripts
- Build processes
- Configuration management
- Development utilities

### Non-Python Usage

Only use other languages when:
- Python is technically insufficient
- Performance constraints proven
- System-level bindings required
- Explicitly justified in PR

## Code Quality Standards

### JavaScript

- Use ESLint configuration
- Follow ES2021+ standards
- Avoid global pollution
- Use const/let, never var
- Proper error handling

### Python

- Follow PEP 8
- Type hints where appropriate
- Docstrings for all functions
- Black for formatting
- Maximum line length: 100

### HTML/CSS

- Semantic HTML5
- Valid syntax
- Accessibility standards (WCAG)
- Mobile-first responsive design

## Development Workflow

### 1. Setup

```bash
# Clone repository
git clone <repo-url>
cd my_music_page

# Install dependencies
make install

# Install git hooks
make hooks
```

### 2. Create Feature Branch

```bash
git checkout -b <category>/<feature-name>
```

### 3. Make Atomic Changes

```bash
# Make ONE logical change
git add <files>
git commit -m "<type>: <description>"

# Repeat for each change
```

### 4. Validate Continuously

```bash
# Run validators
make validate

# Run full build
make build
```

### 5. Push and Create PR

```bash
git push origin <branch-name>
# Create PR on GitHub
```

## Pull Request Requirements

### PR Description Must Include

1. **Scope** - What changes were made
2. **Rationale** - Why changes were necessary
3. **Impact** - What was improved
4. **Safety** - Why changes are safe
5. **Exclusions** - What was intentionally not changed

### PR Checklist

- [ ] Atomic commits with clear messages
- [ ] All validators pass
- [ ] Changes are isolated and safe
- [ ] Documentation updated
- [ ] No unrelated changes
- [ ] Branch name follows convention

## Testing

### Validation

```bash
# HTML validation
python3 tools/validate_html.py

# JSON validation
python3 tools/validate_json.py

# Full validation
make validate
```

### Development Server

```bash
# Start server
make serve

# Or with custom port
python3 tools/dev_server.py 8000
```

## Code Review

### Before Submitting

1. Run all validators
2. Check commit history
3. Review changed files
4. Ensure atomic commits
5. Update documentation

### Review Criteria

- Code quality and clarity
- Proper separation of concerns
- Security considerations
- Performance impact
- Maintainability

## Architecture Principles

### Separation of Concerns

- Configuration separate from code
- Validation separate from logic
- Presentation separate from data

### Maintainability

- Clear responsibility boundaries
- Minimal coupling
- Maximum cohesion
- Self-documenting code

### Safety

- Defensive coding
- Input validation
- Error boundaries
- Graceful degradation

## Documentation

### Required Documentation

- Code comments for complex logic
- Docstrings for all Python functions
- README updates for new features
- Configuration examples

### Documentation Style

- Clear and concise
- Examples where helpful
- Avoid over-commenting
- Focus on "why" not "what"

## Questions?

If you have questions about these guidelines:

1. Check existing code for examples
2. Review recent PRs
3. Ask in PR comments
4. Contact maintainers

---

**Remember**: Quality over speed. Every line of code is a maintenance commitment.
