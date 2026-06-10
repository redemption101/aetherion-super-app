import couchdb


class CouchRepo:
    def __init__(self):
        self.server = couchdb.Server("http://admin:admin@localhost:5984/")
        self.db = self.server["supersonic"]

    def add_institution_doc(self, doc: dict):
        return self.db.save(doc)
