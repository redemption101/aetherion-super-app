from security.newtonian.core import NewtonianCore
from security.newtonian.ruleset import NewtonianRuleset
from security.newtonian.audit_log import NewtonianAuditLog
from security.newtonian.mesh_verifier import NewtonianMeshVerifier
from security.newtonian.middleware import NewtonianMiddleware

ruleset = NewtonianRuleset()
audit = NewtonianAuditLog(mesh.pg, mesh.cassandra)
verifier = NewtonianMeshVerifier(mesh.pg, mesh.mongo)
guard = NewtonianCore(ruleset, audit, verifier)

app.add_middleware(NewtonianMiddleware, guard=guard)

from security.newtonian.honeypot import NewtonianHoneypot

honeypot = NewtonianHoneypot(audit)
guard = NewtonianCore(ruleset, audit, verifier, honeypot)
from security.newtonian.honeypot import NewtonianHoneypot

honeypot = NewtonianHoneypot(audit)
guard = NewtonianCore(ruleset, audit, verifier, honeypot)
