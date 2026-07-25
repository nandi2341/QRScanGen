import { jsPDF } from 'jspdf';
import { ScanLog } from '../../types/database';

export class ExportFormattedService {
  static exportToCSV(logs: ScanLog[]): string {
    const headers = ['ID', 'Timestamp', 'Format', 'Parsed Type', 'Session', 'Tags', 'Content', 'Notes'];
    const rows = logs.map(l => [
      l.id || '',
      new Date(l.timestamp).toISOString(),
      l.format,
      l.parsedType,
      l.sessionName || '',
      (l.tags || []).join(';'),
      `"${l.rawContent.replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  static exportToTXT(logs: ScanLog[]): string {
    return logs.map(l => {
      const dateStr = new Date(l.timestamp).toLocaleString();
      return `[${dateStr}] [${l.format}] (${l.parsedType}) ${l.sessionName ? `[Session: ${l.sessionName}]` : ''}\nContent: ${l.rawContent}\nTags: ${(l.tags || []).join(', ')}\n----------------------------------------`;
    }).join('\n\n');
  }

  static exportToJSON(logs: ScanLog[]): string {
    return JSON.stringify(logs, null, 2);
  }

  static async exportToPDF(logs: ScanLog[], title = 'Scan Logs Report'): Promise<Blob> {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total items: ${logs.length}`, 14, 28);
    doc.line(14, 32, 196, 32);

    let y = 40;
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      const dateStr = new Date(log.timestamp).toLocaleString();
      doc.setFont('helvetica', 'bold');
      doc.text(`#${i + 1} - ${log.parsedType} (${log.format}) - ${dateStr}`, 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(`Content: ${log.rawContent}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 4;
    }

    return doc.output('blob');
  }

  static downloadFile(filename: string, content: string | Blob, mimeType: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
