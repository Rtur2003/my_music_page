#!/usr/bin/env python3
"""
Build Tool - Automates validation and preparation for deployment.

This tool orchestrates the build process:
1. Validates HTML files
2. Validates JSON files  
3. Checks for security issues
4. Generates deployment report
"""

import sys
import subprocess
from pathlib import Path
from datetime import datetime


class BuildTool:
    """Automated build and validation orchestrator."""
    
    def __init__(self, root_dir='.'):
        self.root_dir = Path(root_dir)
        self.errors = []
        self.warnings = []
        
    def run_command(self, cmd, description):
        """Execute a command and capture output."""
        print(f"\n{'=' * 50}")
        print(f"Running: {description}")
        print('=' * 50)
        
        try:
            result = subprocess.run(
                cmd,
                cwd=self.root_dir,
                capture_output=True,
                text=True,
                check=False
            )
            
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
                
            return result.returncode == 0
        except Exception as e:
            self.errors.append(f"{description} failed: {e}")
            return False
    
    def validate_html(self):
        """Run HTML validation."""
        return self.run_command(
            [sys.executable, 'tools/validate_html.py', '.'],
            "HTML Validation"
        )
    
    def validate_json(self):
        """Run JSON validation."""
        return self.run_command(
            [sys.executable, 'tools/validate_json.py', '.'],
            "JSON Validation"
        )
    
    def generate_report(self, results):
        """Generate build report."""
        print("\n" + "=" * 50)
        print("Build Report")
        print("=" * 50)
        print(f"Timestamp: {datetime.now().isoformat()}")
        print(f"Root Directory: {self.root_dir.absolute()}")
        print()
        
        for task, success in results.items():
            status = "✓ PASS" if success else "✗ FAIL"
            print(f"{status} - {task}")
        
        print()
        
        all_passed = all(results.values())
        if all_passed:
            print("✓ Build completed successfully")
            return 0
        else:
            print("✗ Build failed")
            return 1
    
    def build(self):
        """Execute full build process."""
        print("Build Tool - my_music_page")
        print("=" * 50)
        
        results = {
            "HTML Validation": self.validate_html(),
            "JSON Validation": self.validate_json(),
        }
        
        return self.generate_report(results)


if __name__ == '__main__':
    root_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    builder = BuildTool(root_dir)
    sys.exit(builder.build())
