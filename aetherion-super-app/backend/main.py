import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from aiokafka import AIOKafkaConsumer
from services.supersonic_mesh_service import SupersonicMeshService
from security.newtonian.core import NewtonianCore
from security.newtonian.ruleset import NewtonianRuleset
from security.newtonian.audit_log import NewtonianAuditLog
from security.newtonian.mesh_verifier import NewtonianMeshVerifier
from security.newtonian.middleware import NewtonianMiddleware

mesh = SupersonicMeshService()
guard = NewtonianCore(NewtonianRuleset(), NewtonianAuditLog(mesh.pg, mesh.cassandra), NewtonianMeshVerifier(mesh.pg, mesh.mongo))
stream_log = []

async def consume_erlang_streams():
    await asyncio.sleep(2)
    try:
        c = AIOKafkaConsumer('test-architecture', bootstrap_servers='localhost:9092', group_id='mesh-group')
        await c.start()
        async for m in c:
            val = m.value.decode('utf-8')
            stream_log.append(val)
            if len(stream_log) > 10: stream_log.pop(0)
            print(f"[KAFKA INGEST] {val}")
    except Exception as e: print(f"Kafka Error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    t = asyncio.create_task(consume_erlang_streams())
    yield
    t.cancel()

app = FastAPI(title="Supersonic Mesh API", lifespan=lifespan)
app.add_middleware(NewtonianMiddleware, guard=guard)

@app.get("/permissions/{username}")
def get_permissions(username: str):
    return {"username": username, "permissions": mesh.get_permissions(username)}

@app.get("/dashboard")
def get_dashboard():
    return {"status": "Operational", "architect": "Mandlenkosi Vundla", "recent_streams": stream_log}
