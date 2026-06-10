import time


class NewtonianRuleset:
    def __init__(self):
        self.forbidden_paths = ["/admin/delete-all", "/root/override"]
        self.user_rate = {}

    def is_forbidden_path(self, path: str) -> bool:
        return path in self.forbidden_paths

    def is_rate_anomaly(self, username: str) -> bool:
        now = time.time()
        if username not in self.user_rate:
            self.user_rate[username] = []
        self.user_rate[username] = [
            t for t in self.user_rate[username] if now - t < 2
        ]
        self.user_rate[username].append(now)
        return len(self.user_rate[username]) > 10

    def validate_payload(self, payload: dict) -> bool:
        if payload is None:
            return True
        return all(len(str(v)) < 5000 for v in payload.values())
# security/newtonian/ruleset.py

class NewtonianRuleset:
    def __init__(self):
        self.forbidden_paths = ["/admin/delete-all", "/root/override"]
        self.honeypot_paths = ["/secret/root", "/hidden/console"]
        self.user_rate = {}

    def is_forbidden_path(self, path: str) -> bool:
        return path in self.forbidden_paths

    def is_honeypot_path(self, path: str) -> bool:
        return path in self.honeypot_paths

    # ... existing rate + payload checks ...

# security/newtonian/ruleset.py

class NewtonianRuleset:
    def __init__(self):
        self.forbidden_paths = ["/admin/delete-all", "/root/override"]
        self.honeypot_paths = ["/secret/root", "/hidden/console"]
        self.user_rate = {}

    def is_forbidden_path(self, path: str) -> bool:
        return path in self.forbidden_paths

    def is_honeypot_path(self, path: str) -> bool:
        return path in self.honeypot_paths

    # ... existing rate + payload checks ...
