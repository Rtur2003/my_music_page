# Makefile for my_music_page development
# Python-based tooling automation

.PHONY: help install validate build serve test clean hooks

# Python interpreter
PYTHON := python3

# Default target
help:
	@echo "Development Tools - my_music_page"
	@echo "=================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make install    - Install Python dependencies"
	@echo "  make validate   - Run all validators"
	@echo "  make build      - Run full build process"
	@echo "  make serve      - Start development server"
	@echo "  make hooks      - Install git pre-commit hooks"
	@echo "  make test       - Run all tests"
	@echo "  make clean      - Clean temporary files"
	@echo ""

# Install dependencies
install:
	@echo "Installing Python dependencies..."
	$(PYTHON) -m pip install -r requirements.txt
	@echo "✓ Dependencies installed"

# Validate all files
validate:
	@echo "Running validations..."
	$(PYTHON) tools/validate_html.py .
	$(PYTHON) tools/validate_json.py .
	@echo "✓ Validation complete"

# Full build process
build:
	@echo "Running build process..."
	$(PYTHON) tools/build.py
	@echo "✓ Build complete"

# Start development server
serve:
	@echo "Starting development server..."
	$(PYTHON) tools/dev_server.py 8000

# Install git hooks
hooks:
	@echo "Installing git pre-commit hooks..."
	$(PYTHON) tools/setup_hooks.py
	@echo "✓ Hooks installed"

# Run tests
test: validate
	@echo "✓ All tests passed"

# Clean temporary files
clean:
	@echo "Cleaning temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Cleanup complete"

# Quick check before commit
pre-commit: validate
	@echo "✓ Pre-commit checks passed"
