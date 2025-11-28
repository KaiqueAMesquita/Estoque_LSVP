package com.lsvp.InventoryManagement.dto.ReportFile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SourceComparasionDTO {

    private String sourceType; // "DOACAO" ou "COMPRA"
    private Long totalQuantity;
    private Double percentage; // 0 a 100
}
