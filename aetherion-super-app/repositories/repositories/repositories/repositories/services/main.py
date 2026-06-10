from fastapi import FastAPI
from pydantic import BaseModel
from services.supersonic_mesh_service import SupersonicMeshService

app = FastAPI(title="Supersonic Mesh API")
mesh = SupersonicMeshService()


class LineageEventIn(BaseModel):
    lineage_id: int
    event_type: str
    payload: str


class LineageDocIn(BaseModel):
    name: str
    description: str | None = None


class InstitutionDocIn(BaseModel):
    name: str
    category: str
    description: str | None = None


@app.get("/permissions/{username}")
def get_permissions(username: str):
    return {"username": username, "permissions": mesh.get_permissions(username)}


@app.get("/entities/{entity_id}")
def get_entity(entity_id: int):
    data = mesh.get_entity_view(entity_id)
    return {"entity": data}


@app.post("/lineage-events")
def post_lineage_event(body: LineageEventIn):
    mesh.record_lineage_event(body.lineage_id, body.event_type, body.payload)
    return {"status": "ok"}


@app.post("/lineages/docs")
def post_lineage_doc(body: LineageDocIn):
    doc_id = mesh.create_lineage_doc(body.dict())
    return {"id": doc_id}


@app.post("/institutions/docs")
def post_institution_doc(body: InstitutionDocIn):
    res = mesh.create_institution_doc(
        {
            "type": "institution",
            "name": body.name,
            "category": body.category,
            "description": body.description,
        }
    )
    return res
