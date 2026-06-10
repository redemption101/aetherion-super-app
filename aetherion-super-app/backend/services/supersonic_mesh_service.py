from repositories.postgres_repo import PostgresRepo
from repositories.cassandra_repo import CassandraRepo
from repositories.mongo_repo import MongoRepo
from repositories.couch_repo import CouchRepo


class SupersonicMeshService:
    def __init__(self):
        self.pg = PostgresRepo()
        self.cassandra = CassandraRepo()
        self.mongo = MongoRepo()
        self.couch = CouchRepo()

    def get_permissions(self, username: str):
        return self.pg.get_user_permissions(username)

    def get_entity_view(self, entity_id: int):
        return self.pg.get_unified_entity(entity_id)

    def record_lineage_event(self, lineage_id: int, event_type: str, payload: str):
        self.cassandra.append_lineage_event(lineage_id, event_type, payload)

    def create_lineage_doc(self, doc: dict):
        return str(self.mongo.add_lineage_document(doc))

    def create_institution_doc(self, doc: dict):
        doc_id, rev = self.couch.add_institution_doc(doc)
        return {"id": doc_id, "rev": rev}
