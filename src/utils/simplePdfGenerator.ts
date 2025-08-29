import { jsPDF } from 'jspdf';
import type { UniformFormData } from '../types/uniform';

interface PDFGeneratorOptions {
  title?: string;
  showStats?: boolean;
}

export const generateSimpleUniformsPDF = (
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
  
  // Cabeçalho da tabela
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Desenhar cabeçalho
  const headerY = yPosition;
  const rowHeight = 10;
  
  const colXPositions = [
    margin,           // Coluna 1: Número (posição inicial)
    margin + 32,      // Coluna 2: Nome (25px de largura para Número)
    margin + 105,     // Coluna 3: Tipo (80px de largura para Nome)
    margin + 140      // Coluna 4: Tamanho (35px de largura para Tipo)
  ];
  
  // Fundo do cabeçalho
  doc.setFillColor(212, 179, 1); // Cor dourada
  doc.rect(margin, headerY - 2, pageWidth - (margin * 2), rowHeight, 'F');
  
  // Texto do cabeçalho
  doc.setTextColor(22, 24, 26);
  doc.text('Número', colXPositions[0] + 5, headerY + 6);
  doc.text('Nome', colXPositions[1] + 5, headerY + 6);
  doc.text('Tipo', colXPositions[2] + 5, headerY + 6);
  doc.text('Tamanho', colXPositions[3] + 5, headerY + 6);
  
  yPosition += rowHeight + 2;
  
  // Dados da tabela
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  uniformes.forEach((uniforme, index) => {
    // Verificar se precisa de nova página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Cor de fundo alternada
    if (index % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 2, pageWidth - (margin * 2), rowHeight, 'F');
    }
    
    // Dados da linha
    doc.text(uniforme.numero.toString(), colXPositions[0] + 5, yPosition + 6);
    doc.text(uniforme.nome, colXPositions[1] + 5, yPosition + 6);
    doc.text(uniforme.tipo, colXPositions[2] + 5, yPosition + 6);
    doc.text(uniforme.tamanho, colXPositions[3] + 5, yPosition + 6);
    
    yPosition += rowHeight;
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Jumentus SC - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadSimpleUniformsPDF = (uniformes: UniformFormData[], filename?: string) => {
  const doc = generateSimpleUniformsPDF(uniformes);
  const defaultFilename = `uniformes-jumentus-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
};

export const printSimpleUniformsPDF = (uniformes: UniformFormData[]) => {
  const doc = generateSimpleUniformsPDF(uniformes);
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
