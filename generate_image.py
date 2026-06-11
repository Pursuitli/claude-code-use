#!/usr/bin/env python3
"""Generate an image with the OpenAI Images API.

Usage:
    export OPENAI_API_KEY=sk-...
    python generate_image.py "a watercolor fox in a forest" -o fox.png
"""

import argparse
import base64
import os
import sys
import urllib.request
import json


def generate(prompt: str, output: str, size: str, model: str) -> None:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit("Error: set the OPENAI_API_KEY environment variable first.")

    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=json.dumps({
            "model": model,
            "prompt": prompt,
            "size": size,
            "n": 1,
        }).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    with urllib.request.urlopen(req) as resp:
        data = json.load(resp)["data"][0]

    if "b64_json" in data:
        image_bytes = base64.b64decode(data["b64_json"])
    else:
        with urllib.request.urlopen(data["url"]) as img:
            image_bytes = img.read()

    with open(output, "wb") as f:
        f.write(image_bytes)
    print(f"Saved image to {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("prompt", help="Text description of the image")
    parser.add_argument("-o", "--output", default="image.png", help="Output file (default: image.png)")
    parser.add_argument("--size", default="1024x1024", help="Image size (default: 1024x1024)")
    parser.add_argument("--model", default="gpt-image-1", help="Model (default: gpt-image-1)")
    args = parser.parse_args()
    generate(args.prompt, args.output, args.size, args.model)
