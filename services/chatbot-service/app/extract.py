from __future__ import annotations

import re


_STATE_ALIASES: dict[str, str] = {
    "mp": "Madhya Pradesh",
    "madhya pradesh": "Madhya Pradesh",
    "up": "Uttar Pradesh",
    "uttar pradesh": "Uttar Pradesh",
    "mh": "Maharashtra",
    "maharashtra": "Maharashtra",
    "bihar": "Bihar",
    "rajasthan": "Rajasthan",
    "gujarat": "Gujarat",
    "karnataka": "Karnataka",
    "tamil nadu": "Tamil Nadu",
    "tn": "Tamil Nadu",
    "kerala": "Kerala",
    "odisha": "Odisha",
    "orissa": "Odisha",
    "west bengal": "West Bengal",
    "wb": "West Bengal",
    "punjab": "Punjab",
    "haryana": "Haryana",
    "assam": "Assam",
    "jharkhand": "Jharkhand",
    "chhattisgarh": "Chhattisgarh",
    "telangana": "Telangana",
    "andhra pradesh": "Andhra Pradesh",
    "ap": "Andhra Pradesh",
    "delhi": "Delhi",
}


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def _extract_income_rupees(text: str) -> int | None:
    t = text.lower()
    # ₹2 lakh / 2 lac / 2 lakhs
    m = re.search(r"(₹|rs\.?\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs)\b", t)
    if m:
        value = float(m.group(2))
        return int(value * 100000)

    # ₹2,00,000 or 200000
    m = re.search(r"(₹|rs\.?\s*)?(\d[\d,]{4,})", t)
    if m:
        num = m.group(2).replace(",", "")
        try:
            return int(num)
        except ValueError:
            return None
    return None


def _extract_land_acres(text: str) -> int | None:
    t = text.lower()
    m = re.search(r"(\d+(?:\.\d+)?)\s*(acre|acres)\b", t)
    if not m:
        return None
    try:
        acres = float(m.group(1))
    except ValueError:
        return None
    # Store as int acres for now (simple schema)
    return int(round(acres))


def extract_profile(message: str, base: dict | None = None) -> dict:
    base = dict(base or {})
    text = message.strip()
    t = _norm(text)

    out: dict = {}

    # Occupation/category keywords (English + minimal Hindi)
    if re.search(r"\bfarmer\b|\bkisan\b|किसान", text, flags=re.IGNORECASE):
        out["is_farmer"] = True
        out["occupation"] = "farmer"
    if re.search(r"\bstudent\b|\bscholarship\b|छात्र|विद्यार्थी", text, flags=re.IGNORECASE):
        out["is_student"] = True
        out["occupation"] = out.get("occupation") or "student"
    if re.search(r"\bbusiness\b|\bmsme\b|\bshop\b|व्यापार", text, flags=re.IGNORECASE):
        out["is_business_owner"] = True
        out["occupation"] = out.get("occupation") or "business_owner"
    if re.search(r"\bjob\b|\bunemployed\b|नौकरी|बेरोजगार", text, flags=re.IGNORECASE):
        out["is_job_seeker"] = True
        out["occupation"] = out.get("occupation") or "job_seeker"

    if re.search(r"\bvillage\b|\brural\b|gaon|गाँव|ग्रामीण", text, flags=re.IGNORECASE):
        out["location_rural"] = True

    if re.search(r"\bsc\b|\bscheduled caste\b", t):
        out["category"] = "SC"
    elif re.search(r"\bst\b|\bscheduled tribe\b", t):
        out["category"] = "ST"
    elif re.search(r"\bobc\b", t):
        out["category"] = "OBC"
    elif re.search(r"\bgeneral\b", t):
        out["category"] = "General"

    if re.search(r"\bdisabled\b|divyang|विकलांग|दिव्यांग", text, flags=re.IGNORECASE):
        out["disability_status"] = True

    # Income
    income = _extract_income_rupees(text)
    if income is not None:
        out["income"] = income

    # Land
    acres = _extract_land_acres(text)
    if acres is not None:
        out["land_ownership"] = True
        out["land_acres"] = acres

    # State detection
    for key, canonical in _STATE_ALIASES.items():
        if re.search(rf"\b{re.escape(key)}\b", t):
            out["state"] = canonical
            break

    merged = dict(base)
    merged.update({k: v for k, v in out.items() if v is not None})
    return merged

