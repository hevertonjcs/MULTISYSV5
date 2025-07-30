import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDataHora, formatMoeda } from '@/utils';

export const generateFullReportPDF = async (cadastros) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 30;
  let yPosition = margin;

  const primaryColor = [4, 120, 87]; 
  const blackColor = [31, 41, 55];

  const addPageIfNeeded = (yPositionBefore) => {
    if (yPositionBefore > doc.internal.pageSize.getHeight() - margin * 2) {
      doc.addPage();
      addHeaderAndFooter();
      return margin;
    }
    return yPositionBefore;
  };

  const addHeaderAndFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount} - Relatório Completo - Gerado em: ${formatDataHora(new Date())}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - margin / 2,
        { align: 'center' }
      );
    }
    doc.setPage(pageCount);
  };
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Relatório Completo de Cadastros', margin, yPosition);
  yPosition += 25;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  doc.text(`Total de Cadastros: ${cadastros.length}`, margin, yPosition);
  yPosition += 20;

  const cadastrosPorVendedor = cadastros.reduce((acc, cadastro) => {
    const vendedor = cadastro.vendedor || 'Vendedor Não Informado';
    if (!acc[vendedor]) {
      acc[vendedor] = [];
    }
    acc[vendedor].push(cadastro);
    return acc;
  }, {});

  const vendedoresOrdenados = Object.keys(cadastrosPorVendedor).sort((a, b) => a.localeCompare(b));

  for (const vendedor of vendedoresOrdenados) {
    yPosition = addPageIfNeeded(yPosition);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Vendedor: ${vendedor}`, margin, yPosition);
    yPosition += 20;

    const tableData = cadastrosPorVendedor[vendedor].map(c => {
      let ultimaObs = 'Nenhuma';
      if (Array.isArray(c.observacao_supervisor) && c.observacao_supervisor.length > 0) {
        ultimaObs = c.observacao_supervisor[0].text || 'Observação inválida';
      } else if (typeof c.observacao_supervisor === 'object' && c.observacao_supervisor !== null) {
        ultimaObs = c.observacao_supervisor.text || 'Observação inválida';
      }
      return [
        c.nome_completo || 'N/A',
        c.cpf || 'N/A',
        c.telefone || 'N/A',
        formatMoeda(c.valor_credito),
        c.status_cliente ? c.status_cliente.replace(/_/g,' ').toUpperCase() : 'N/A',
        ultimaObs
      ];
    });

    doc.autoTable({
      startY: yPosition,
      head: [['Nome do Cliente', 'CPF', 'Telefone', 'Valor Simulado', 'Status', 'Última Observação']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { textColor: blackColor, fontSize: 7, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: margin, right: margin, bottom: margin + 20, left: margin },
      didDrawPage: (data) => {
        yPosition = data.cursor.y;
      },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 100 }, 
        1: { cellWidth: 70 },   
        2: { cellWidth: 70 },   
        3: { cellWidth: 70 },  
        4: { cellWidth: 60 },
        5: { cellWidth: 'auto' }, 
      }
    });
    yPosition = doc.autoTable.previous.finalY + 20;
  }

  addHeaderAndFooter();

  doc.save(`relatorio_completo_cadastros_${new Date().toISOString().split('T')[0]}.pdf`);
};