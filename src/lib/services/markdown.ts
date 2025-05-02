import MarkdownIt from 'markdown-it';

export class MarkdownService {
  static async export(content: string, title: string): Promise<void> {
    const md = new MarkdownIt();
    const html = md.render(content);
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 