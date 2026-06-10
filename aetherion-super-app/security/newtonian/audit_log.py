from datetime import datetime


class NewtonianAuditLog:
    def __init__(self, pg_repo, cassandra_repo):
        self.pg = pg_repo
        self.cassandra = cassandra_repo

    def log_event(self, event_type: str, request_info: dict):
        timestamp = datetime.utcnow().isoformat()

        # Log to Cassandra (event stream)
        self.cassandra.append_lineage_event(
            lineage_id=999,
            event_type=event_type,
            payload=str(request_info)
        )

        # Log to Postgres (audit table)
        with self.pg.conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO audit_log (event_type, username, path, payload, created_at)
                VALUES (%s, %s, %s, %s, NOW())
                """,
                (
                    event_type,
                    request_info.get("username"),
                    request_info.get("path"),
                    str(request_info.get("payload")),
                ),
            )
