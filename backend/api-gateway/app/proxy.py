from __future__ import annotations

from typing import Any

import httpx
from fastapi import HTTPException, Request, Response, status


async def proxy_request(
    *,
    request: Request,
    upstream_base_url: str,
    upstream_path: str,
    method: str,
    json_body: Any | None = None,
) -> Response:
    url = f"{upstream_base_url}{upstream_path}"
    headers = {}
    # Forward auth header if present
    if "authorization" in request.headers:
        headers["authorization"] = request.headers["authorization"]

    async with httpx.AsyncClient(timeout=httpx.Timeout(20.0)) as client:
        try:
            resp = await client.request(
                method=method,
                url=url,
                params=dict(request.query_params),
                json=json_body,
                headers=headers,
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Upstream unavailable") from exc

    return Response(content=resp.content, status_code=resp.status_code, media_type=resp.headers.get("content-type"))

