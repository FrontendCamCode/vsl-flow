import PDFDocument from 'pdfkit';

export class PDFService {
  static async export(content: string, title: string) {
    return new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Uint8Array[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const blob = new Blob(chunks, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      });

      doc.on('error', reject);

      // Add title
      doc.fontSize(24).text(title, { align: 'center' });
      doc.moveDown(2);

      // Add content
      doc.fontSize(12).text(content);

      doc.end();
    });
  }
} 