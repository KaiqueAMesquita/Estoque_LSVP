package com.lsvp.InventoryManagement.dto.ReportFile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockCoverageDTO {

    private String categoryName;
    private Long currentStock;
    private Double dailyConsumptionAvg; // Média de consumo/dia
    private Integer daysOfSupply;       // Dias que o estoque dura
    private String status;              // "CRÍTICO", "BAIXO", "CONFORTÁVEL", "EXCESSO"

    
}
