import psycopg2
from cassandra.cluster import Cluster
from pymongo import MongoClient
import couchdb


class SupersonicMesh:
    def __init__(self):
        # Postgres
        self.pg_conn = psycopg2.connect(
            dbname="supersonic",
            user="supersonic_user",
            password="Mv@20217$$",
            host="localhost",
            port=5432,
        )
        self.pg_conn.autocommit = True

        # Cassandra
        self.cassandra_cluster = Cluster(["localhost"], port=9042)
        self.cassandra_session = self.cassandra_cluster.connect("supersonic")

        # MongoDB
        self.mongo_client = MongoClient("mongodb://root:root@localhost:27017")
        self.mongo_db = self.mongo_client["supersonic"]

        # CouchDB
        self.couch_server = couchdb.Server("http://admin:admin@localhost:5984/")
        self.couch_db = self.couch_server["supersonic"]

    # ---------- Postgres ----------
    def get_user_permissions(self, username: str):
        with self.pg_conn.cursor() as cur:
            cur.execute(
                """
                SELECT permission
                FROM user_effective_permissions
                WHERE username = %s
                ORDER BY permission
                """,
                (username,),
            )
            return [row[0] for row in cur.fetchall()]

    # ---------- Cassandra ----------
    def append_lineage_event(self, lineage_id: int, event_type: str, payload: str):
        from uuid import uuid1
        from datetime import datetime

        self.cassandra_session.execute(
            """
            INSERT INTO lineage_events (lineage_id, event_id, event_type, payload, created_at)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (lineage_id, uuid1(), event_type, payload, datetime.utcnow()),
        )

    # ---------- MongoDB ----------
    def add_lineage_document(self, doc: dict):
        return self.mongo_db.lineages.insert_one(doc).inserted_id

    # ---------- CouchDB ----------
    def add_institution_doc(self, doc: dict):
        return self.couch_db.save(doc)


if __name__ == "__main__":
    mesh = SupersonicMesh()

    print("Mandlenkosi permissions:", mesh.get_user_permissions("mandlenkosi"))

    mesh.append_lineage_event(
        lineage_id=1,
        event_type="CREATED",
        payload='{"by":"mandlenkosi"}',
    )

    mongo_id = mesh.add_lineage_document(
        {
            "name": "Aetherion Founders Lineage",
            "description": "Synced from Supersonic core",
        }
    )
    print("Mongo lineage doc id:", mongo_id)

    couch_id, couch_rev = mesh.add_institution_doc(
        {
            "type": "institution",
            "name": "Aetherion Research Institute",
            "category": "Research Institute",
        }
    )
    print("Couch institution doc:", couch_id, couch_rev)
