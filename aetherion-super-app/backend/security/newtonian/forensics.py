class NewtonianForensics:
    def __init__(self, pg_repo):
        self.pg = pg_repo

    def record(self, request_info: dict, score: int):
        try:
            with self.pg.conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO honeypot_forensics
                    (timestamp, ip, path, method, payload, headers, score)
                    VALUES (NOW(), %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        request_info.get("ip", "unknown"),
                        request_info.get("path"),
                        request_info.get("method"),
                        str(request_info.get("payload")),
                        str(request_info.get("headers")),
                        score,
                    ),
                )
        except Exception as e:
            print(f"Forensics DB Warning: {e}")
