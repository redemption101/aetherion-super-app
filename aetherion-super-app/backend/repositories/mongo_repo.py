from pymongo import MongoClient


class MongoRepo:
    def __init__(self):
        self.client = MongoClient("mongodb://root:root@localhost:27017")
        self.db = self.client["supersonic"]

    def add_lineage_document(self, doc: dict):
        return self.db.lineages.insert_one(doc).inserted_id
