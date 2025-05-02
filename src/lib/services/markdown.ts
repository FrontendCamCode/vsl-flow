import MarkdownIt from 'markdown-it';

export class MarkdownService {
  static async export(content: string, title: string) {
    const md = new MarkdownIt();
    const markdownContent = `# ${title}\n\n${content}`;
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 