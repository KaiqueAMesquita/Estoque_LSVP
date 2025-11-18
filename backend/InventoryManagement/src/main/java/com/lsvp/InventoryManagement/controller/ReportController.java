package com.lsvp.InventoryManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lsvp.InventoryManagement.dto.Report.AveragePriceDTO;
import com.lsvp.InventoryManagement.dto.Report.ExpiringLotDTO;
import com.lsvp.InventoryManagement.dto.Report.MonthlyStockFlowDTO;
import com.lsvp.InventoryManagement.dto.Report.TotalSpentDTO;
import com.lsvp.InventoryManagement.service.Report.ReportService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Relatórios", description = "Relatórios e analytics do sistema")
@RequestMapping("api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * GET /api/reports/expiring-lots
     * Retorna lotes em estoque próximos de vencer, de forma paginada.
     */
    @GetMapping("/expiring-lots")
    public ResponseEntity<Page<ExpiringLotDTO>> getExpiringLots(
            @RequestParam(defaultValue = "30") int daysUntilExpiry,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        Page<ExpiringLotDTO> result = reportService.getExpiringLots(daysUntilExpiry, page, limit);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/reports/total-spent
     * Retorna valor total gasto (em centavos) em compras em um determinado mês/ano.
     */
    @GetMapping("/total-spent")
    public ResponseEntity<TotalSpentDTO> getTotalSpent(
            @RequestParam int month,
            @RequestParam int year
    ) {
        TotalSpentDTO result = reportService.getTotalSpentByMonth(month, year);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/reports/average-price
     * Retorna preço médio ponderado por categoria, mensal.
     */
    @GetMapping("/average-price")
    public ResponseEntity<List<AveragePriceDTO>> getAveragePrice(
            @RequestParam Long categoryId,
            @RequestParam int startMonth,
            @RequestParam int startYear,
            @RequestParam int endMonth,
            @RequestParam int endYear
    ) {
        List<AveragePriceDTO> result = reportService.getAveragePriceByCategory(categoryId, startMonth, startYear, endMonth, endYear);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/reports/stock-flow
     * Retorna o fluxo de estoque (Entrada/Saída) por categoria, mensal.
     * (Alternativa ao "Estoque Médio")
     */
    @GetMapping("/stock-flow")
    public ResponseEntity<List<MonthlyStockFlowDTO>> getStockFlow(
            @RequestParam Long categoryId,
            @RequestParam int startMonth,
            @RequestParam int startYear,
            @RequestParam int endMonth,
            @RequestParam int endYear
    ) {
        List<MonthlyStockFlowDTO> result = reportService.getMonthlyStockFlow(categoryId, startMonth, startYear, endMonth, endYear);
        return ResponseEntity.ok(result);
    }
}
