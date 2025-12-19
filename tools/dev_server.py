#!/usr/bin/env python3
"""
Development Server - Local HTTP server with live reload capability.

This script provides a simple HTTP server for local development testing
of the music portfolio website.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with proper MIME types and CORS."""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom log format."""
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")


def start_server(port=8000, directory='.'):
    """Start the development server."""
    os.chdir(directory)
    
    with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
        print("=" * 50)
        print("Development Server")
        print("=" * 50)
        print(f"Serving at: http://localhost:{port}")
        print(f"Directory: {Path(directory).absolute()}")
        print("\nPress Ctrl+C to stop the server")
        print("=" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")
            sys.exit(0)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    directory = sys.argv[2] if len(sys.argv) > 2 else '.'
    
    start_server(port, directory)
