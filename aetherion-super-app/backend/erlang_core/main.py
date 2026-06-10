import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from aiokafka import AIOKafkaConsumer
from services.supersonic_mesh_service import SupersonicMeshService
from security.newtonian.core import NewtonianCore
from security.newtonian.ruleset import NewtonianRuleset
from security.newtonian.audit_log import NewtonianAuditLog
from security.newtonian.mesh_verifier import NewtonianMeshVerifier
from security.newtonian.middleware import NewtonianMiddleware

mesh = SupersonicMeshService()
ruleset = NewtonianRuleset()
audit = NewtonianAuditLog(mesh.pg, mesh.cassandra)
verifier = NewtonianMeshVerifier(mesh.pg, mesh.mongo)
guard = NewtonianCore(ruleset, audit, verifier)

stream_log = []

async def consume_erlang_streams():
    await asyncio.sleep(5)
    consumer = AIOKafkaConsumer('test-architecture', bootstrap_servers='localhost:9092', group_id="mesh-group")
    await consumer.start()
    try:
        async for msg in consumer:
            val = msg.value.decode('utf-8')
            stream_log.append(val)
            if len(stream_log) > 8: stream_log.pop(0)
            print(f"[STREAM] {val}")
    except Exception as e:
        print(f"Kafka Consumer Error: {e}")
    finally:
        await consumer.stop()

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(consume_erlang_streams())
    yield
    task.cancel()

app = FastAPI(title="Supersonic Mesh API", lifespan=lifespan)
app.add_middleware(NewtonianMiddleware, guard=guard)

@app.get("/permissions/{username}")
def get_permissions(username: str):
    return {"username": username, "permissions": mesh.get_permissions(username)}

@app.get("/dashboard", response_class=HTMLResponse)
async def render_dashboard(request: Request):
    items = "".join([f"<li style='color:#4ade80;font-family:monospace;margin-bottom:8px;'>► {e}</li>" for e in reversed(stream_log)])
    return f"""
    <html>
        <head><title>Aetherion Monitor</title><script src="https://cdn.tailwindcss.com"></script><meta http-equiv="refresh" content="2"></head>
        <body class="bg-slate-950 text-white p-8 font-sans">
            <h1 class="text-2xl font-black text-cyan-400 border-b border-slate-800 pb-2 mb-6">AETHERION REAL-TIME CONSOLE</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 bg-slate-900 rounded border border-slate-800">
                    <h2 class="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3">System Status</h2>
                    <p class="text-sm text-slate-300">User Context: <span class="text-white font-mono">mandlenkosi</span></p>
                    <p class="text-sm text-slate-300 mt-1">Network Role: <span class="text-cyan-400 font-bold font-mono">GLOBAL_MESH_ARCHITECT</span></p>
                </div>
                <div class="p-4 bg-slate-900 rounded border border-slate-800">
                    <h2 class="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3">Live Telemetry Ingestion</h2>
                    <ul>{items if items else "<p class='text-slate-500 text-xs italic'>Awaiting stream data from BEAM...</p>"}</ul>
                </div>
            </div>
        </body>
    </html>
    """
