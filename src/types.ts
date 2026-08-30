export interface MessageLine {
  id: string;
  type: 'user' | 'bot' | 'system' | 'error' | 'streaming';
  text: string;
  html?: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface BlogItem {
  id: string;
  name: string;
  url?: string;
  posts?: { totalItems: number };
  pages?: { totalItems: number };
}

export interface PostItem {
  id: string;
  title: string;
  url: string;
  status: string;
  published?: string;
  updated?: string;
  labels?: string[];
  content?: string;
}

export interface PageItem {
  id: string;
  title: string;
  url: string;
  status: string;
  published?: string;
}

export interface CommentItem {
  id: string;
  content: string;
  author?: {
    displayName: string;
    image?: { url: string };
  };
  post?: {
    id: string;
  };
  published?: string;
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export type ApiActionType = 
  | 'POST_CREATE'
  | 'POST_UPDATE'
  | 'POST_DELETE'
  | 'POST_PUBLISH'
  | 'POST_REVERT'
  | 'POST_LIST'
  | 'POST_SEARCH'
  | 'PAGE_CREATE'
  | 'PAGE_UPDATE'
  | 'PAGE_DELETE'
  | 'PAGE_LIST'
  | 'COMMENTS_LIST'
  | 'BLOG_STATS'
  | 'GSC_QUERY'
  | 'RSS_ANALYZE'
  | 'EXPORT_BACKUP';

export interface GeminiPlanPayload {
  apiAction: ApiActionType;
  targetResourceId?: string;
  searchQuery?: string;
  changeSummary?: string;
  title: string;
  metaDescription: string;
  labels: string[];
  htmlContent: string;
  mermaidDiagramCode?: string;
  mathFormulas?: string;
  affiliateComparisonHtml?: string;
  mediaQuery: string;
  jsonLdSchema: string;
}

export interface StagedAction {
  action: ApiActionType;
  blogId: string;
  token: string;
  resourceId: string;
  payload: {
    title: string;
    compiledHtml: string;
    labels?: string[];
    metaDescription?: string;
  };
}

export interface AuditResult {
  passed: boolean;
  confidence: string;
  wordCount: number;
  headings: number;
  tables: number;
}
