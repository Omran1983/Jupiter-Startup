#!/usr/bin/env python3
import sys
from pathlib import Path

def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: validate_sql.py <sql_file1> [sql_file2...]")
        return 2

    ok = True
    for p in map(Path, sys.argv[1:]):
        s = p.read_text(encoding="utf-8")
        if s.count("$$") % 2 != 0:
            print(f"[FAIL] {p}: uneven $$ blocks")
            ok = False

        # crude check: must end with newline
        if not s.endswith("\n"):
            print(f"[WARN] {p}: does not end with newline")

        # crude check: create policy without semicolon lines often breaks
        if "create policy" in s.lower() and ";" not in s:
            print(f"[WARN] {p}: no semicolons detected (likely broken SQL)")
            ok = False

        print(f"[OK] {p}")

    return 0 if ok else 1

if __name__ == "__main__":
    raise SystemExit(main())
