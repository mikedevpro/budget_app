#!/usr/bin/env python3
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


BASE = "http://127.0.0.1:8000"


def get_json(path):
    with urlopen(f"{BASE}{path}", timeout=5) as response:
        data = response.read().decode("utf-8")
        return json.loads(data)


def main():
    try:
        health = get_json("/health")
        assert health.get("ok") is True, f"Unexpected /health payload: {health}"

        insight = get_json("/insights/emotion")
        assert isinstance(insight.get("state"), str), f"Missing insight state: {insight}"
        assert isinstance(insight.get("message"), str), f"Missing insight message: {insight}"
        assert 0 <= insight.get("confidence", 0) <= 1, f"Unexpected confidence: {insight}"

        print("Backend smoke test passed.")
    except (HTTPError, URLError, AssertionError, ValueError) as exc:
        print(f"Backend smoke test failed: {exc}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
