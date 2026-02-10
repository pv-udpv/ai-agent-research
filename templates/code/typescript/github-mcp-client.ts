/**
 * GitHub MCP Client Template (TypeScript)
 * 
 * Reusable client for GitHub operations with rate limiting.
 * 
 * Usage:
 *   const client = new GitHubMCPClient();
 *   const issues = await client.listIssues('owner', 'repo');
 */

interface RateLimitConfig {
  perMinute: number;
  perHour: number;
}

interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  state: string;
  labels: string[];
  created_at: string;
  updated_at: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

class RateLimiter {
  private perMinute: number;
  private perHour: number;
  private minuteCount: number = 0;
  private hourCount: number = 0;
  private minuteWindow: number;
  private hourWindow: number;

  constructor(config: RateLimitConfig = { perMinute: 20, perHour: 120 }) {
    this.perMinute = config.perMinute;
    this.perHour = config.perHour;
    this.minuteWindow = Math.floor(Date.now() / 60000);
    this.hourWindow = Math.floor(Date.now() / 3600000);
  }

  async checkAndWait(): Promise<void> {
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000);
    const currentHour = Math.floor(now / 3600000);

    // Reset counters
    if (currentMinute !== this.minuteWindow) {
      this.minuteCount = 0;
      this.minuteWindow = currentMinute;
    }

    if (currentHour !== this.hourWindow) {
      this.hourCount = 0;
      this.hourWindow = currentHour;
    }

    // Wait if needed
    if (this.minuteCount >= this.perMinute) {
      const waitMs = 60000 - (now % 60000);
      console.log(`Minute rate limit reached. Waiting ${waitMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
      this.minuteCount = 0;
    }

    if (this.hourCount >= this.perHour) {
      const waitMs = 3600000 - (now % 3600000);
      console.log(`Hour rate limit reached. Waiting ${waitMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
      this.hourCount = 0;
    }

    // Increment
    this.minuteCount++;
    this.hourCount++;
  }
}

export class GitHubMCPClient {
  private rateLimiter?: RateLimiter;

  constructor(rateLimit: boolean = true) {
    this.rateLimiter = rateLimit ? new RateLimiter() : undefined;
  }

  private async callTool<T>(
    toolName: string,
    params: Record<string, any>
  ): Promise<T> {
    if (this.rateLimiter) {
      await this.rateLimiter.checkAndWait();
    }

    // In real implementation, call actual MCP tool
    throw new Error("Implement tool calling mechanism");
  }

  async listIssues(
    owner: string,
    repo: string,
    options: {
      state?: "open" | "closed";
      perPage?: number;
      maxResults?: number;
    } = {}
  ): Promise<Issue[]> {
    const { state = "open", perPage = 30, maxResults } = options;
    const issues: Issue[] = [];
    let after: string | undefined;

    while (true) {
      const result = await this.callTool<{
        issues: Issue[];
        pageInfo: PageInfo;
      }>("mcp_tool_github-mcp-direct_list_issues", {
        owner,
        repo,
        state,
        perPage,
        after,
      });

      issues.push(...result.issues);

      if (!result.pageInfo.hasNextPage) break;
      after = result.pageInfo.endCursor;

      if (maxResults && issues.length >= maxResults) {
        return issues.slice(0, maxResults);
      }
    }

    return issues;
  }

  async createIssue(
    owner: string,
    repo: string,
    data: {
      title: string;
      body: string;
      labels?: string[];
      assignees?: string[];
    }
  ): Promise<Issue> {
    return this.callTool<Issue>("mcp_tool_github-mcp-direct_issue_write", {
      method: "create",
      owner,
      repo,
      ...data,
      labels: data.labels || [],
      assignees: data.assignees || [],
    });
  }

  async getFileContents(
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<string> {
    const result = await this.callTool<{ content: string }>(
      "mcp_tool_github-mcp-direct_get_file_contents",
      { owner, repo, path, ref: ref || "" }
    );
    return result.content;
  }
}

// Example usage
async function main() {
  const client = new GitHubMCPClient();

  // List issues
  const issues = await client.listIssues("pv-udpv", "ai-agent-research", {
    state: "open",
    maxResults: 10,
  });
  console.log(`Found ${issues.length} issues`);

  // Create issue
  const newIssue = await client.createIssue("pv-udpv", "ai-agent-research", {
    title: "Research Task: Investigate Tool X",
    body: "Detailed description...",
    labels: ["RESEARCH"],
  });
  console.log(`Created issue #${newIssue.number}`);
}
