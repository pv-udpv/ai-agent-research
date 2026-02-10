# Tool: {tool_name}

## Metadata
- **Category**: {category}
- **MCP Server**: {server_name}
- **Requires Approval**: {yes/no}
- **Discovered On**: {YYYY-MM-DD}

## Description

{One-sentence description of what this tool does}

## Schema

```json
{schema}
```

## Parameters

| Parameter | Type | Required | Default | Description | Constraints |
|-----------|------|----------|---------|-------------|-------------|
| param1 | string | yes | - | Description | Max 100 chars |
| param2 | integer | no | 10 | Description | Min: 1, Max: 100 |

## Usage Examples

### Basic Usage

```python
# Example 1: Simple case
result = await tool_name(
    param1="value1",
    param2=20
)
```

### Advanced Usage

```python
# Example 2: With error handling
try:
    result = await tool_name(
        param1="value1",
        param2=50
    )
except ToolError as e:
    print(f"Error: {e.message}")
```

## Response Format

```json
{
  "field1": "value",
  "field2": 123
}
```

## Constraints

- **Rate Limit**: {if known}
- **Token Impact**: {estimate tokens consumed}
- **Pagination**: {max items per page}
- **Dependencies**: {list of tools this depends on}

## Edge Cases Tested

- [x] Empty inputs
- [x] Maximum parameter values
- [x] Concurrent calls
- [x] Invalid types
- [ ] Network failures

## Error Handling

### Error Type 1: ValidationError

**Trigger**: Invalid parameter type  
**Message**: `Expected string, got integer`  
**Recovery**: Validate types before calling

### Error Type 2: RateLimitExceeded

**Trigger**: >X requests/minute  
**Message**: `Rate limit exceeded`  
**Recovery**: Wait {seconds}s and retry

## Integration Patterns

**Works well with**:
- `tool_a` - Use case description
- `tool_b` - Use case description

**Anti-patterns**:
- Don't call before `tool_c` - reason
- Avoid concurrent calls with `tool_d` - reason

## Performance Notes

- **Typical latency**: {ms}
- **Token cost**: {estimate}
- **Success rate**: {%}
- **Optimal batch size**: {n}

## Benchmarks

See `benchmarks/performance/{tool-name}.json`

## Related Tools

- `related_tool_1` - Similar functionality
- `related_tool_2` - Complementary tool

## Notes

{Any additional observations, quirks, or insights}

---

**Last Updated**: {YYYY-MM-DD}  
**Tested Versions**: {version}  
**Status**: ✅ Fully Documented
