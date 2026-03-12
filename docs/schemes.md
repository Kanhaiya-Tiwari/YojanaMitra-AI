# Scheme dataset notes

## Target

Store **200–500+ schemes** with structured fields:
- Scheme name, ministry, description, target group
- Income/age limits, state availability
- Required documents
- Application link + last date
- Benefits
- Eligibility rules (JSON)

## Included in repo

- A small seed file is included to make local dev usable.
- You should expand the dataset by importing official sources (mygov.in, india.gov.in, state portals).

## Import approach (recommended)

1. Normalize raw scheme text into the structured schema.
2. Convert eligibility text into the rule DSL (`eligibility_rules` JSON).
3. Upsert into Scheme Service via admin endpoints or a loader script.

## Fraud warnings

The Scheme Service flags suspicious application links (e.g., domains not matching typical government domains like `*.gov.in`).
This is advisory only; always verify official sources.

