class NewtonianScoring:
    def score(self, request_info: dict) -> int:
        score = 0
        payload_str = str(request_info.get("payload", "")).lower()
        path_str = request_info.get("path", "")
        
        if "sql" in payload_str: score += 30
        if path_str.startswith("/hidden"): score += 40
        if len(payload_str) > 2000: score += 20
        if "admin" in path_str: score += 10
        return score
