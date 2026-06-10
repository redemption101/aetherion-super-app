from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class NewtonianMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, guard):
        super().__init__(app)
        self.guard = guard

    async def dispatch(self, request: Request, call_next):
        body = await request.json() if request.method in ["POST", "PUT"] else {}

        request_info = {
            "path": request.url.path,
            "method": request.method,
            "username": request.headers.get("x-username", "anonymous"),
            "payload": body,
            "timestamp": request.scope.get("time"),
        }

        allowed, reason = self.guard.inspect_request(request_info)
        if not allowed:
            return JSONResponse({"error": reason}, status_code=403)

        return await call_next(request)
