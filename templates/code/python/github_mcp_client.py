"""GitHub MCP Client Template

Reusable client for interacting with GitHub via MCP tools.

Usage:
    client = GitHubMCPClient()
    issues = await client.list_issues('owner', 'repo', state='open')
"""

import asyncio
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import json


class RateLimiter:
    """Rate limiter with sliding window"""
    
    def __init__(self, per_minute: int = 20, per_hour: int = 120):
        self.per_minute = per_minute
        self.per_hour = per_hour
        self.minute_count = 0
        self.hour_count = 0
        self.minute_window = int(datetime.now().timestamp() // 60)
        self.hour_window = int(datetime.now().timestamp() // 3600)
    
    async def check_and_wait(self) -> None:
        """Check limits and wait if necessary"""
        now = datetime.now()
        current_minute = int(now.timestamp() // 60)
        current_hour = int(now.timestamp() // 3600)
        
        # Reset counters on window change
        if current_minute != self.minute_window:
            self.minute_count = 0
            self.minute_window = current_minute
        
        if current_hour != self.hour_window:
            self.hour_count = 0
            self.hour_window = current_hour
        
        # Wait if limits exceeded
        if self.minute_count >= self.per_minute:
            wait_seconds = 60 - (now.timestamp() % 60)
            print(f"Minute rate limit reached. Waiting {wait_seconds:.1f}s...")
            await asyncio.sleep(wait_seconds)
            self.minute_count = 0
        
        if self.hour_count >= self.per_hour:
            wait_seconds = 3600 - (now.timestamp() % 3600)
            print(f"Hour rate limit reached. Waiting {wait_seconds:.1f}s...")
            await asyncio.sleep(wait_seconds)
            self.hour_count = 0
        
        # Increment counters
        self.minute_count += 1
        self.hour_count += 1


class GitHubMCPClient:
    """High-level GitHub MCP client with rate limiting"""
    
    def __init__(self, rate_limit: bool = True):
        self.rate_limiter = RateLimiter() if rate_limit else None
    
    async def _call_tool(self, tool_name: str, **params) -> Dict[str, Any]:
        """Call MCP tool with rate limiting"""
        if self.rate_limiter:
            await self.rate_limiter.check_and_wait()
        
        # In real implementation, this would call the actual MCP tool
        # For template purposes, this is a placeholder
        raise NotImplementedError("Implement tool calling mechanism")
    
    async def list_issues(
        self,
        owner: str,
        repo: str,
        state: str = "open",
        per_page: int = 30,
        max_results: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """List issues with automatic pagination"""
        issues = []
        after = None
        
        while True:
            result = await self._call_tool(
                "mcp_tool_github-mcp-direct_list_issues",
                owner=owner,
                repo=repo,
                state=state,
                perPage=per_page,
                after=after
            )
            
            issues.extend(result.get("issues", []))
            
            # Check pagination
            page_info = result.get("pageInfo", {})
            if not page_info.get("hasNextPage"):
                break
            
            after = page_info.get("endCursor")
            
            # Check max results
            if max_results and len(issues) >= max_results:
                issues = issues[:max_results]
                break
        
        return issues
    
    async def create_issue(
        self,
        owner: str,
        repo: str,
        title: str,
        body: str,
        labels: Optional[List[str]] = None,
        assignees: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Create a new issue"""
        return await self._call_tool(
            "mcp_tool_github-mcp-direct_issue_write",
            method="create",
            owner=owner,
            repo=repo,
            title=title,
            body=body,
            labels=labels or [],
            assignees=assignees or []
        )
    
    async def get_file_contents(
        self,
        owner: str,
        repo: str,
        path: str,
        ref: Optional[str] = None
    ) -> str:
        """Get file contents from repository"""
        result = await self._call_tool(
            "mcp_tool_github-mcp-direct_get_file_contents",
            owner=owner,
            repo=repo,
            path=path,
            ref=ref or ""
        )
        return result.get("content", "")


async def main():
    """Example usage"""
    client = GitHubMCPClient()
    
    # List open issues
    issues = await client.list_issues(
        owner="pv-udpv",
        repo="ai-agent-research",
        state="open",
        max_results=10
    )
    print(f"Found {len(issues)} open issues")
    
    # Create a new issue
    new_issue = await client.create_issue(
        owner="pv-udpv",
        repo="ai-agent-research",
        title="Research Task: Investigate Tool X",
        body="Detailed description...",
        labels=["RESEARCH"]
    )
    print(f"Created issue #{new_issue['number']}")


if __name__ == "__main__":
    asyncio.run(main())
