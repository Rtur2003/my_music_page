#!/usr/bin/env python3
"""
Pre-commit Hook Installer - Sets up git hooks for code quality.

This script installs git pre-commit hooks to automatically validate
code before commits.
"""

import os
import sys
from pathlib import Path


HOOK_SCRIPT = '''#!/bin/sh
# Pre-commit hook - Run validations before commit

echo "Running pre-commit validations..."

# Run Python build tool
python3 tools/build.py

if [ $? -ne 0 ]; then
    echo "❌ Pre-commit validation failed"
    echo "Fix the errors above before committing"
    exit 1
fi

echo "✅ Pre-commit validation passed"
exit 0
'''


def install_hooks(repo_root='.'):
    """Install pre-commit hooks."""
    git_hooks_dir = Path(repo_root) / '.git' / 'hooks'
    
    if not git_hooks_dir.exists():
        print("Error: Not in a git repository")
        return False
    
    pre_commit_hook = git_hooks_dir / 'pre-commit'
    
    try:
        with open(pre_commit_hook, 'w') as f:
            f.write(HOOK_SCRIPT)
        
        os.chmod(pre_commit_hook, 0o755)
        
        print("✓ Pre-commit hook installed successfully")
        print(f"  Location: {pre_commit_hook}")
        return True
        
    except Exception as e:
        print(f"Error installing hook: {e}")
        return False


def uninstall_hooks(repo_root='.'):
    """Remove pre-commit hooks."""
    git_hooks_dir = Path(repo_root) / '.git' / 'hooks'
    pre_commit_hook = git_hooks_dir / 'pre-commit'
    
    if pre_commit_hook.exists():
        pre_commit_hook.unlink()
        print("✓ Pre-commit hook removed")
        return True
    else:
        print("No pre-commit hook found")
        return False


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'uninstall':
        success = uninstall_hooks()
    else:
        print("Installing pre-commit hooks...")
        print("=" * 50)
        success = install_hooks()
    
    sys.exit(0 if success else 1)
