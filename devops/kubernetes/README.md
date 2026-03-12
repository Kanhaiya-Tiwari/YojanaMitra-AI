# Kubernetes manifests (starter)

This folder contains **starter** manifests you can adapt for a real cluster.

Recommended:
- Use a managed Postgres (RDS/CloudSQL) instead of in-cluster DB for production.
- Store secrets in a secret manager (AWS SM / GCP SM) and sync to K8s.
- Add HPA, PodDisruptionBudgets, and proper readiness/liveness probes.

