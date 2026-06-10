from cassandra.cluster import Cluster
from uuid import uuid1
from datetime import datetime


class CassandraRepo:
    def __init__(self):
        self.cluster = Cluster(["localhost"], port=9042)
        self.session = self.cluster.connect("supersonic")

    def append_lineage_event(self, lineage_id: int, event_type: str, payload: str):
        self.session.execute(
            """
            INSERT INTO lineage_events (lineage_id, event_id, event_type, payload, created_at)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (lineage_id, uuid1(), event_type, payload, datetime.utcnow()),
        )
