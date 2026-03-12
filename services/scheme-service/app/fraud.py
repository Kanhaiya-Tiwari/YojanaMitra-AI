from __future__ import annotations

from urllib.parse import urlparse


_TRUSTED_SUFFIXES = (
    ".gov.in",
    ".nic.in",
)

_TRUSTED_HOSTS = (
    "india.gov.in",
    "www.india.gov.in",
    "mygov.in",
    "www.mygov.in",
)


def fraud_warnings(application_link: str | None) -> list[str]:
    if not application_link:
        return []

    try:
        parsed = urlparse(application_link)
    except Exception:  # noqa: BLE001
        return ["Application link looks invalid. Prefer official government portals."]

    host = (parsed.hostname or "").lower()
    scheme = (parsed.scheme or "").lower()

    warnings: list[str] = []
    if scheme != "https":
        warnings.append("Prefer HTTPS links; avoid submitting sensitive documents on non-HTTPS sites.")

    if not host:
        warnings.append("Application link has no hostname. Prefer official government portals.")
        return warnings

    if host in _TRUSTED_HOSTS:
        return warnings

    if not host.endswith(_TRUSTED_SUFFIXES):
        warnings.append(
            "This link does not look like a typical government domain. Do not pay agents; verify on official portals.",
        )
    return warnings

