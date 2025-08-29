
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { UniformFormData } from '../types/uniform';

interface PDFGeneratorOptions {
  title?: string;
  showStats?: boolean;
}

export const generateUniformsPDF = (
  uniformes: UniformFormData[], 
  options: PDFGeneratorOptions = {}
) => {
  const { title = 'Lista de Uniformes - Jumentus SC', showStats = true } = options;
  
  // Criar novo documento PDF
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;
  
  // Título principal
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Data e hora atual
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Gerado em: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Estatísticas (se habilitadas)
  if (showStats && uniformes.length > 0) {
    const totalJogadores = uniformes.filter(u => u.tipo === 'Jogador').length;
    const totalGoleiros = uniformes.filter(u => u.tipo === 'Goleiro').length;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo:', margin, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`• Total de uniformes: ${uniformes.length}`, margin + 10, yPosition);
    yPosition += 6;
    doc.text(`• Jogadores: ${totalJogadores}`, margin + 10, yPosition);
    yPosition += 6;
    doc.text(`• Goleiros: ${totalGoleiros}`, margin + 10, yPosition);
    
    yPosition += 15;
  }
  
  // Preparar dados para a tabela
  const tableData = uniformes.map(uniforme => [
    uniforme.numero.toString(),
    uniforme.nome,
    uniforme.tipo,
    uniforme.tamanho
  ]);
  
  // Gerar tabela
  autoTable(doc, {
    startY: yPosition,
    head: [['Número', 'Nome', 'Tipo', 'Tamanho']],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: [212, 179, 1], // Cor dourada do Jumentus
      textColor: [22, 24, 26],   // Texto escuro
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 25 }, // Número
      1: { halign: 'left', cellWidth: 60 },   // Nome
      2: { halign: 'center', cellWidth: 30 }, // Tipo
      3: { halign: 'center', cellWidth: 25 }  // Tamanho
    },
    margin: { left: margin, right: margin },
    didDrawCell: (data: { column: { index: number; }; cell: { text: string[]; }; }) => {
      // Destacar goleiros com cor diferente
      if (data.column.index === 2 && data.cell.text[0] === 'Goleiro') {
        doc.setFillColor(220, 252, 231); // Verde claro
      }
    }
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Jumentus SC - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadUniformsPDF = (uniformes: UniformFormData[], filename?: string) => {
  const doc = generateUniformsPDF(uniformes);
  const defaultFilename = `uniformes-jumentus-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
};

export const printUniformsPDF = (uniformes: UniformFormData[]) => {
  const doc = generateUniformsPDF(uniformes);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // Abrir em nova janela para impressão
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      // Limpar URL após uso
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    };
  }
};
