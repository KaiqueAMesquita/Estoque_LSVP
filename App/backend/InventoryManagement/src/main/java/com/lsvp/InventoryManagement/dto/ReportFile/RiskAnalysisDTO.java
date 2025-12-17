package com.lsvp.InventoryManagement.dto.ReportFile;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RiskAnalysisDTO {

    private String productDescription; // Nome do Produto + Categoria
    private String unitCode;
    private LocalDate expirationDate;
    private int quantityInStock;
    private double estimatedConsumptionBeforeExpiry; // Quanto vamos comer até vencer
    private double estimatedWaste; // Quanto vai sobrar e estragar
    private String riskLevel; // "ALTO", "MÉDIO"
    
}
