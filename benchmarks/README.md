# Benchmark Data Format

## Performance Benchmark Schema

```json
{
  "benchmark_id": "uuid-v4",
  "tool_name": "mcp_tool_github-mcp-direct_list_issues",
  "scenario": "Paginate through 100 issues",
  "timestamp": "2026-02-10T20:23:00Z",
  "iterations": 10,
  "metrics": {
    "latency": {
      "min_ms": 150,
      "max_ms": 500,
      "avg_ms": 280,
      "p50_ms": 270,
      "p95_ms": 450,
      "p99_ms": 490
    },
    "tokens": {
      "min": 1200,
      "max": 1800,
      "avg": 1500,
      "total": 15000
    },
    "success": {
      "total_calls": 10,
      "successful_calls": 9,
      "failed_calls": 1,
      "success_rate": 0.90
    },
    "errors": [
      {
        "type": "RateLimitExceeded",
        "count": 1,
        "message": "API rate limit exceeded"
      }
    ]
  },
  "environment": {
    "agent_model": "Sonnet 4.5",
    "mcp_server_version": "1.0.0",
    "date": "2026-02-10"
  }
}
```

## Report Format

```markdown
# Benchmark Report: {Scenario Name}

**Date**: YYYY-MM-DD  
**Agent**: {model-version}  
**Iterations**: N

## Executive Summary

{2-3 sentence summary of findings}

## Methodology

{Describe how the benchmark was conducted}

## Results

### Latency

| Metric | Value | Unit |
|--------|-------|------|
| Average | X | ms |
| P50 | Y | ms |
| P95 | Z | ms |

### Token Usage

| Metric | Value | Unit |
|--------|-------|------|
| Average | X | tokens |
| Total | Y | tokens |

### Success Rate

- **Total Calls**: X
- **Successful**: Y (Z%)
- **Failed**: A (B%)

### Error Analysis

1. **Error Type 1**: Description (count: X)
2. **Error Type 2**: Description (count: Y)

## Analysis

{Detailed interpretation of results}

### Key Findings

1. Finding 1 with evidence
2. Finding 2 with evidence
3. Finding 3 with evidence

### Bottlenecks Identified

- Bottleneck 1: Description and impact
- Bottleneck 2: Description and impact

## Recommendations

1. **Optimization 1**: Action and expected impact
2. **Optimization 2**: Action and expected impact
3. **Optimization 3**: Action and expected impact

## Comparison with Previous Benchmarks

{If applicable, show improvement/regression trends}

---

**Benchmark ID**: {uuid}  
**Raw Data**: `performance/{tool-name}.json`
```

## File Naming Convention

- Performance data: `performance/{tool-name}-{scenario-slug}.json`
- Reports: `reports/YYYY-MM-{report-name}.md`

## Aggregation Scripts

See `templates/code/python/benchmark-aggregator.py`
