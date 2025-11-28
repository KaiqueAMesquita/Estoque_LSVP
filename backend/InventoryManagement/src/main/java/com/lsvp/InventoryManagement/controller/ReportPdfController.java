package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.service.Report.PdfService;
import com.lsvp.InventoryManagement.service.Report.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.util.Pair; // Ou use sua classe wrapper se tiver criado uma
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/pdf") // Prefixo base para todos os PDFs
@Tag(name = "Relatórios PDF", description = "Download de relatórios gerenciais em formato PDF")
public class ReportPdfController {

    private final ReportService reportService;
    private final PdfService pdfService;

    public ReportPdfController(ReportService reportService, PdfService pdfService) {
        this.reportService = reportService;
        this.pdfService = pdfService;
    }

    @Operation(summary = "Relatório de Posição de Estoque", description = "Gera PDF com listagem atual do estoque ou cozinha")
    @GetMapping("/stock-report")
    public ResponseEntity<byte[]> getStockReportPdf(@RequestParam String location) {
        // location = "ESTOQUE" ou "COZINHA"
        ContainerType type = location.equalsIgnoreCase("COZINHA") ? ContainerType.PREPARACAO : ContainerType.ESTOQUE;
        
        // Pega os dados do Service
        var data = reportService.getStockPositionData(type);
        
        // Gera o PDF
        // data.getFirst() = Lista, data.getSecond() = Stats
        byte[] pdf = null;
        try {
             pdf = pdfService.generatePrettyStockReport("Estoque Atual - " + location, data.getFirst(), data.getSecond());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }

        return createPdfResponse(pdf, "estoque_" + location.toLowerCase() + ".pdf");
    }

    @Operation(summary = "Relatório de Cobertura", description = "Gera PDF com análise de dias de duração do estoque")
    @GetMapping("/coverage-report")
    public ResponseEntity<byte[]> getCoverageReportPdf() {
        byte[] pdf = reportService.generateCoverageReportPdf();
        return createPdfResponse(pdf, "cobertura_estoque.pdf");
    }

    @Operation(summary = "Relatório de Risco", description = "Gera PDF com projeção de desperdício por vencimento")
    @GetMapping("/risk-report")
    public ResponseEntity<byte[]> getRiskReportPdf() {
        byte[] pdf = reportService.generateRiskReportPdf();
        return createPdfResponse(pdf, "analise_risco.pdf");
    }

    @Operation(summary = "Relatório de Origem", description = "Gera PDF comparativo entre Doação e Compra")
    @GetMapping("/source-report")
    public ResponseEntity<byte[]> getSourceReportPdf(
            @RequestParam int month,
            @RequestParam int year
    ) {
        byte[] pdf = reportService.generateSourceComparisonPdf(month, year);
        return createPdfResponse(pdf, "origem_produtos_" + month + "_" + year + ".pdf");
    }

    // --- Método Auxiliar para Headers HTTP ---
    private ResponseEntity<byte[]> createPdfResponse(byte[] pdfBytes, String fileName) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // "attachment" força o download
        headers.setContentDispositionFormData("attachment", fileName);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
