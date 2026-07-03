#!/usr/bin/env python3
"""
HTML Validator - Validates HTML files for syntax and structure.

This tool validates HTML files to ensure they follow proper standards
and identifies potential issues before deployment.
"""

import sys
import os
from pathlib import Path
from html.parser import HTMLParser
import re


class HTMLValidator(HTMLParser):
    """HTML syntax validator with error reporting."""
    
    def __init__(self):
        super().__init__()
        self.errors = []
        self.warnings = []
        self.tag_stack = []
        self.self_closing_tags = {
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 
            'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
            'path', 'circle', 'rect', 'line', 'polyline', 'polygon'  # SVG elements
        }
        
    def handle_starttag(self, tag, attrs):
        if tag not in self.self_closing_tags:
            self.tag_stack.append(tag)
            
    def handle_endtag(self, tag):
        if tag in self.self_closing_tags:
            self.warnings.append(f"Self-closing tag '{tag}' has end tag")
            return
            
        if not self.tag_stack:
            self.errors.append(f"Closing tag '{tag}' without opening tag")
            return
            
        if self.tag_stack[-1] != tag:
            self.errors.append(
                f"Tag mismatch: expected '{self.tag_stack[-1]}', got '{tag}'"
            )
        else:
            self.tag_stack.pop()


def validate_html_file(filepath):
    """Validate a single HTML file."""
    validator = HTMLValidator()
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            validator.feed(content)
    except Exception as e:
        return False, [f"Error reading file: {e}"], []
    
    if validator.tag_stack:
        validator.errors.append(
            f"Unclosed tags: {', '.join(validator.tag_stack)}"
        )
    
    return len(validator.errors) == 0, validator.errors, validator.warnings


def validate_directory(directory='.'):
    """Validate all HTML files in directory."""
    html_files = list(Path(directory).glob('**/*.html'))
    
    if not html_files:
        print("No HTML files found")
        return True
    
    print(f"Validating {len(html_files)} HTML files...\n")
    
    all_valid = True
    for filepath in html_files:
        rel_path = os.path.relpath(filepath, directory)
        valid, errors, warnings = validate_html_file(filepath)
        
        if not valid:
            all_valid = False
            print(f"[FAIL] {rel_path}")
            for error in errors:
                print(f"  ERROR: {error}")
        else:
            print(f"[PASS] {rel_path}")
            
        for warning in warnings:
            print(f"  WARNING: {warning}")
    
    return all_valid


if __name__ == '__main__':
    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    print("HTML Validator")
    print("=" * 50)
    
    success = validate_directory(directory)
    
    if success:
        print("\n[PASS] All HTML files are valid")
        sys.exit(0)
    else:
        print("\n[FAIL] HTML validation failed")
        sys.exit(1)
