package com.lsvp.InventoryManagement.service.Report;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lsvp.InventoryManagement.dto.ReportFile.CategorySourceReportDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.CategoryStockReportDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.GeneralStatsDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.RiskAnalysisDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.SourceComparasionDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.StockCoverageDTO;
import org.springframework.stereotype.Service; 

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service 
public class PdfService {

    // 1. Relatório Bonito de Estoque
    public byte[] generatePrettyStockReport(String title, List<CategoryStockReportDTO> data, GeneralStatsDTO stats) throws IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            addHeader(document, title);

            // Tabela de Dados
            PdfPTable table = new PdfPTable(new float[]{4, 2, 2, 2, 2}); 
            table.setWidthPercentage(100);
            
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            Color headerBg = new Color(50, 100, 150); 

            addStyledCell(table, "CATEGORIA", headerFont, headerBg);
            addStyledCell(table, "QTD ATUAL", headerFont, headerBg);
            addStyledCell(table, "MÍNIMO", headerFont, headerBg);
            addStyledCell(table, "MÁXIMO", headerFont, headerBg);
            addStyledCell(table, "STATUS", headerFont, headerBg);

            boolean alternate = false;
            Color lightGray = new Color(240, 240, 240);

            for (CategoryStockReportDTO item : data) {
                Color rowColor = alternate ? lightGray : Color.WHITE;
                
                addStyledCell(table, item.getCategoryName(), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, String.valueOf(item.getCurrentQuantity()), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, (item.getMinQuantity() != null ? String.valueOf(item.getMinQuantity()) : "-"), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, (item.getMaxQuantity() != null ? String.valueOf(item.getMaxQuantity()) : "-"), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                
                Color statusColor = Color.BLACK;
                // Status de Estoque
                if ("CRÍTICO".equals(item.getStatus())) statusColor = new Color(200, 0, 0); // Vermelho
                else if ("EXCESSO".equals(item.getStatus())) statusColor = new Color(200, 150, 0); // Laranja
                else if ("OK".equals(item.getStatus())) statusColor = new Color(0, 120, 0); // Verde
                
                // Status de Cozinha (NOVO)
                else if ("DISPONÍVEL".equals(item.getStatus())) statusColor = new Color(0, 100, 200); // Azul
                else if ("-".equals(item.getStatus())) statusColor = Color.GRAY; // Cinza

                Font statusFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, statusColor);
                addStyledCell(table, item.getStatus(), statusFont, rowColor);

                alternate = !alternate;
            }
            document.add(table);

            // Estatísticas
            document.add(new Paragraph(" "));
            PdfPTable statsTable = new PdfPTable(2);
            statsTable.setWidthPercentage(50);
            statsTable.setHorizontalAlignment(Element.ALIGN_LEFT);
            
            addStyledCell(statsTable, "Total de Itens:", FontFactory.getFont(FontFactory.HELVETICA_BOLD), Color.LIGHT_GRAY);
            addStyledCell(statsTable, String.valueOf(stats.getTotalItems()), FontFactory.getFont(FontFactory.HELVETICA), Color.WHITE);
            
            addStyledCell(statsTable, "% Perecíveis:", FontFactory.getFont(FontFactory.HELVETICA_BOLD), Color.LIGHT_GRAY);
            addStyledCell(statsTable, String.format("%.1f %%", stats.getPercentPerishable()), FontFactory.getFont(FontFactory.HELVETICA), Color.WHITE);
            
            document.add(statsTable);
            document.close();

        } catch (DocumentException e) {
            throw new IOException("Erro PDF", e);
        }
        return out.toByteArray();
    }

    // 2. Relatório de Cobertura
    public byte[] generateCoverageReport(String title, List<StockCoverageDTO> items) throws IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            addHeader(document, title); 

            PdfPTable table = new PdfPTable(new float[]{4, 2, 2, 2, 3});
            table.setWidthPercentage(100);
            
            Color headerBg = new Color(50, 100, 150);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);

            addStyledCell(table, "CATEGORIA", headerFont, headerBg);
            addStyledCell(table, "ESTOQUE", headerFont, headerBg);
            addStyledCell(table, "MÉDIA/DIA", headerFont, headerBg);
            addStyledCell(table, "DIAS", headerFont, headerBg);
            addStyledCell(table, "STATUS", headerFont, headerBg);

            for (StockCoverageDTO item : items) {
                Color rowColor = Color.WHITE;
                addStyledCell(table, item.getCategoryName(), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, String.valueOf(item.getCurrentStock()), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, String.format("%.1f", item.getDailyConsumptionAvg()), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                
                String daysText = (item.getDaysOfSupply() > 900) ? "> 900" : String.valueOf(item.getDaysOfSupply());
                addStyledCell(table, daysText, FontFactory.getFont(FontFactory.HELVETICA), rowColor);

                Color statusColor = Color.BLACK;
                if ("CRÍTICO".equals(item.getStatus())) statusColor = Color.RED;
                else if ("EXCESSO".equals(item.getStatus())) statusColor = new Color(200, 150, 0); 
                else if ("CONFORTÁVEL".equals(item.getStatus())) statusColor = new Color(0, 128, 0); 

                Font statusFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, statusColor);
                addStyledCell(table, item.getStatus(), statusFont, rowColor);
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Erro PDF", e);
        }
        return out.toByteArray();
    }

    // 3. Relatório de Risco
    public byte[] generateRiskReport(String title, List<RiskAnalysisDTO> items) throws IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            addHeader(document, title);

            PdfPTable table = new PdfPTable(new float[]{4, 3, 2, 2, 2});
            table.setWidthPercentage(100);
            
            Color headerBg = new Color(150, 50, 50); 
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);

            addStyledCell(table, "PRODUTO", headerFont, headerBg);
            addStyledCell(table, "LOTE / VALID.", headerFont, headerBg);
            addStyledCell(table, "QTD", headerFont, headerBg);
            addStyledCell(table, "SOBRA EST.", headerFont, headerBg);
            addStyledCell(table, "RISCO", headerFont, headerBg);

            for (RiskAnalysisDTO item : items) {
                Color rowColor = "ALTO".equals(item.getRiskLevel()) ? new Color(255, 230, 230) : Color.WHITE;
                
                addStyledCell(table, item.getProductDescription(), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, item.getUnitCode() + "\n" + item.getExpirationDate(), FontFactory.getFont(FontFactory.HELVETICA, 10), rowColor);
                addStyledCell(table, String.valueOf(item.getQuantityInStock()), FontFactory.getFont(FontFactory.HELVETICA), rowColor);
                addStyledCell(table, String.format("%.1f", item.getEstimatedWaste()), FontFactory.getFont(FontFactory.HELVETICA_BOLD), rowColor);
                
                Font riskFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.RED);
                addStyledCell(table, item.getRiskLevel(), riskFont, rowColor);
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Erro PDF", e);
        }
        return out.toByteArray();
    }

    // 4. Relatório de Origem
    public byte[] generateSourceReport(String title, List<CategorySourceReportDTO> categories) throws IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            addHeader(document, title);

            PdfPTable table = new PdfPTable(new float[]{3, 2, 5}); 
            table.setWidthPercentage(100);
            
            Color headerBg = new Color(50, 100, 150);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            Font catFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.BLACK);
            Color catBg = new Color(220, 220, 220); // Cinza claro para separar categorias

            // Cabeçalho Principal
            addStyledCell(table, "ORIGEM", headerFont, headerBg);
            addStyledCell(table, "QUANTIDADE", headerFont, headerBg);
            addStyledCell(table, "PROPORÇÃO (%)", headerFont, headerBg);

            for (CategorySourceReportDTO catData : categories) {
                
                // --- LINHA DE CABEÇALHO DA CATEGORIA (Ocupa as 3 colunas) ---
                PdfPCell catCell = new PdfPCell(new Phrase(catData.getCategoryName().toUpperCase(), catFont));
                catCell.setColspan(3);
                catCell.setBackgroundColor(catBg);
                catCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                catCell.setPadding(5);
                table.addCell(catCell);

                // --- LINHAS DE ORIGEM ---
                for (SourceComparasionDTO item : catData.getSources()) {
                    addStyledCell(table, item.getSourceType(), FontFactory.getFont(FontFactory.HELVETICA), Color.WHITE);
                    addStyledCell(table, String.valueOf(item.getTotalQuantity()), FontFactory.getFont(FontFactory.HELVETICA), Color.WHITE);

                    // Barra Visual
                    PdfPCell barCell = new PdfPCell();
                    PdfPTable barTable = new PdfPTable(1);
                    float width = (item.getPercentage() > 0) ? item.getPercentage().floatValue() : 0.1f;
                    barTable.setWidthPercentage(width);
                    barTable.setHorizontalAlignment(Element.ALIGN_LEFT);
                    
                    PdfPCell colorBar = new PdfPCell(new Phrase(String.format("%.1f%%", item.getPercentage()), FontFactory.getFont(FontFactory.HELVETICA, 9, Color.WHITE)));
                    
                    if (item.getSourceType().contains("DOACAO")) colorBar.setBackgroundColor(new Color(60, 179, 113)); 
                    else colorBar.setBackgroundColor(new Color(205, 92, 92)); 
                    
                    colorBar.setBorder(0);
                    colorBar.setHorizontalAlignment(Element.ALIGN_CENTER);
                    barTable.addCell(colorBar);
                    
                    barCell.addElement(barTable);
                    barCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    table.addCell(barCell);
                }
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Erro PDF", e);
        }
        return out.toByteArray();
    }

    // --- Métodos Auxiliares ---

    private void addHeader(Document doc, String title) throws DocumentException {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
        Paragraph p = new Paragraph(title.toUpperCase(), titleFont);
        p.setAlignment(Element.ALIGN_CENTER);
        doc.add(p);
        
        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);
        Paragraph pDate = new Paragraph("Gerado em: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), dateFont);
        pDate.setAlignment(Element.ALIGN_CENTER);
        pDate.setSpacingAfter(20);
        doc.add(pDate);
    }

    private void addStyledCell(PdfPTable table, String text, Font font, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(6);
        cell.setBorderColor(Color.GRAY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }
}