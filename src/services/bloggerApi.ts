import { BlogItem, CommentItem, GscRow, PageItem, PostItem } from '../types';

export const BloggerAPI = {
  async discoverBlogs(token: string): Promise<BlogItem[]> {
    const res = await fetch('https://blogger.googleapis.com/v3/users/self/blogs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Discover Blogs Error [${res.status}]: ${errText}`);
    }
    const data = await res.json();
    return data.items || [];
  },

  async getBlog(blogId: string, token: string): Promise<BlogItem> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Fetch Blog Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  },

  async listPosts(blogId: string, token: string, status = 'LIVE,DRAFT'): Promise<PostItem[]> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/posts?status=${status}&maxResults=50`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`List Posts Error [${res.status}]: ${errText}`);
    }
    const data = await res.json();
    return data.items || [];
  },

  async searchPosts(blogId: string, token: string, query: string): Promise<PostItem[]> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/posts/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Search Posts Error [${res.status}]: ${errText}`);
    }
    const data = await res.json();
    return data.items || [];
  },

  async getPost(blogId: string, token: string, postId: string): Promise<PostItem> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/posts/${postId}?view=ADMIN`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Get Post Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  },

  async createPost(
    blogId: string,
    token: string,
    payload: { title: string; compiledHtml: string; labels?: string[]; metaDescription?: string },
    isDraft = true
  ): Promise<PostItem> {
    const queryParam = isDraft ? '?isDraft=true' : '';
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/posts${queryParam}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kind: 'blogger#post',
        title: payload.title,
        content: payload.compiledHtml,
        labels: payload.labels || [],
        customMetaData: payload.metaDescription || ''
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Create Post Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  },

  async updatePost(
    blogId: string,
    token: string,
    postId: string,
    payload: { title: string; compiledHtml: string; labels?: string[]; metaDescription?: string }
  ): Promise<PostItem> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kind: 'blogger#post',
        title: payload.title,
        content: payload.compiledHtml,
        labels: payload.labels || [],
        customMetaData: payload.metaDescription || ''
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Update Post Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  },

  async deletePost(blogId: string, token: string, postId: string): Promise<boolean> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Delete Post Error [${res.status}]: ${errText}`);
    }
    return true;
  },

  async listPages(blogId: string, token: string): Promise<PageItem[]> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/pages?status=LIVE,DRAFT`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`List Pages Error [${res.status}]: ${errText}`);
    }
    const data = await res.json();
    return data.items || [];
  },

  async createPage(
    blogId: string,
    token: string,
    payload: { title: string; compiledHtml: string },
    isDraft = true
  ): Promise<PageItem> {
    const queryParam = isDraft ? '?isDraft=true' : '';
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/pages${queryParam}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kind: 'blogger#page',
        title: payload.title,
        content: payload.compiledHtml
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Create Page Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  },

  async updatePage(
    blogId: string,
    token: string,
    pageId: string,
    payload: { title: string; compiledHtml: string }
  ): Promise<PageItem> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kind: 'blogger#page',
        title: payload.title,
        content: payload.compiledHtml
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Update Page Error [${res.status}]: ${errText}`);
    }
    return await res.json();
  },

  async deletePage(blogId: string, token: string, pageId: string): Promise<boolean> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/pages/${pageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Delete Page Error [${res.status}]: ${errText}`);
    }
    return true;
  },

  async listBlogComments(blogId: string, token: string): Promise<CommentItem[]> {
    const res = await fetch(`https://blogger.googleapis.com/v3/blogs/${blogId}/comments?maxResults=50`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`List Comments Error [${res.status}]: ${errText}`);
    }
    const data = await res.json();
    return data.items || [];
  },

  async querySearchConsole(siteUrl: string, token: string): Promise<GscRow[]> {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 28);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 15
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Search Console Error [${res.status}]: ${errText}`);
    }
    const data = await res.json();
    return data.rows || [];
  },

  async fetchRssFeed(feedUrl: string): Promise<string> {
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
      if (!res.ok) return '';
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        return data.items
          .slice(0, 5)
          .map((i: { title?: string; description?: string }) => `- ${i.title || 'Untitled'}: ${(i.description || '').substring(0, 120)}`)
          .join('\n');
      }
    } catch {
      // Ignore RSS fetch errors
    }
    return '';
  },

  async fetchMediaAsset(query: string): Promise<string | null> {
    if (!query || query.trim() === '') return null;
    try {
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=File:${encodeURIComponent(query)}&gsrlimit=2&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=800&format=json&origin=*`;
      const res = await fetch(wikiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages) as Array<{
            imageinfo?: Array<{
              thumburl?: string;
              extmetadata?: {
                LicenseShortName?: { value?: string };
                Artist?: { value?: string };
              };
            }>;
          }>;
          for (const page of pages) {
            if (!page.imageinfo || !page.imageinfo[0]) continue;
            const info = page.imageinfo[0];
            const meta = info.extmetadata || {};
            const license = (meta.LicenseShortName?.value || 'Public Domain').toUpperCase();
            const author = (meta.Artist?.value || 'Wikimedia Contributor').replace(/<[^>]*>/g, '');

            return `
<figure style="margin: 2rem 0; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #f8fafc; text-align: center;">
  <img src="${info.thumburl}" alt="${query}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" loading="lazy"/>
  <figcaption style="padding: 8px 12px; font-size: 12px; color: #64748b; background: #f1f5f9; border-top: 1px solid #cbd5e1;">
    <strong>Image:</strong> ${query} | <strong>Credit:</strong> ${author} (${license} via Wikimedia Commons)
  </figcaption>
</figure>`;
          }
        }
      }
    } catch {
      // Wikimedia fallback
    }
    return null;
  },

  async pingIndexNow(url: string, host: string): Promise<void> {
    if (!url || !host) return;
    try {
      const payload = {
        host,
        key: 'viblogger-indexnow-agent',
        urlList: [url]
      };
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } catch {
      // IndexNow error caught
    }
  }
};
