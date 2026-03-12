from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class EvalResult:
    passed: bool
    reasons: list[str]


def _get_field(context: dict, path: str):
    cur = context
    for part in path.split("."):
        if not isinstance(cur, dict):
            return None
        cur = cur.get(part)
    return cur


def _truthy(value) -> bool:
    return bool(value)


def _compare(op: str, left, right) -> bool:
    if op == "exists":
        return left is not None
    if op == "truthy":
        return _truthy(left)
    if op == "falsy":
        return not _truthy(left)

    if op == "eq":
        if isinstance(left, str) and isinstance(right, str):
            return left.strip().lower() == right.strip().lower()
        return left == right
    if op == "ne":
        return not _compare("eq", left, right)

    if left is None:
        return False

    if op in {"lt", "lte", "gt", "gte"}:
        try:
            if op == "lt":
                return left < right
            if op == "lte":
                return left <= right
            if op == "gt":
                return left > right
            if op == "gte":
                return left >= right
        except TypeError:
            return False

    if op == "in":
        try:
            return left in right
        except TypeError:
            return False

    if op == "contains":
        try:
            return right in left
        except TypeError:
            return False

    return False


def evaluate(rule: dict | None, context: dict) -> EvalResult:
    if not rule:
        return EvalResult(passed=True, reasons=["No explicit rule; requires manual verification."])

    if "all" in rule:
        reasons: list[str] = []
        for child in rule.get("all") or []:
            res = evaluate(child, context)
            if not res.passed:
                reasons.extend(res.reasons)
        return EvalResult(passed=(len(reasons) == 0), reasons=reasons)

    if "any" in rule:
        failures: list[str] = []
        for child in rule.get("any") or []:
            res = evaluate(child, context)
            if res.passed:
                return EvalResult(passed=True, reasons=[])
            failures.extend(res.reasons)
        return EvalResult(passed=False, reasons=failures or ["No option matched."])

    if "not" in rule:
        res = evaluate(rule.get("not") or {}, context)
        return EvalResult(passed=not res.passed, reasons=([] if not res.passed else ["Negated rule matched."]))

    field = rule.get("field")
    op = rule.get("op")
    value = rule.get("value")
    if not field or not op:
        return EvalResult(passed=False, reasons=["Invalid rule definition."])

    left = _get_field(context, str(field))
    ok = _compare(str(op), left, value)
    if ok:
        return EvalResult(passed=True, reasons=[])
    return EvalResult(passed=False, reasons=[f"Rule failed: {field} {op} {value}"])

