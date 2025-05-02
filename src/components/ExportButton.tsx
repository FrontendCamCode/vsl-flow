"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Download,
  FileText,
  FileDown,
  Clipboard
} from 'lucide-react';
import { DocxService } from '@/lib/services/docx';
import { PDFService } from '@/lib/services/pdf';
import { MarkdownService } from '@/lib/services/markdown';

interface ExportButtonProps {
  content: string;
  title: string;
}

export function ExportButton({ content, title }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'docx' | 'pdf' | 'markdown' | 'clipboard') => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'docx':
          await DocxService.export(content, title);
          break;
        case 'pdf':
          await PDFService.export(content, title);
          break;
        case 'markdown':
          await MarkdownService.export(content, title);
          break;
        case 'clipboard':
          await navigator.clipboard.writeText(content);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="sm"
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
        <div className="py-1">
          <button
            onClick={() => handleExport('docx')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileText className="h-4 w-4" />
            Export as Word
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileDown className="h-4 w-4" />
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('markdown')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileDown className="h-4 w-4" />
            Export as Markdown
          </button>
          <button
            onClick={() => handleExport('clipboard')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Clipboard className="h-4 w-4" />
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
} 