package com.lsvp.InventoryManagement.dto.ReportFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStockReportDTO {

    private String categoryName;
    private Long currentQuantity;
    private Integer minQuantity; // Do cadastro da categoria
    private Integer maxQuantity; // Do cadastro da categoria
    private String status;       // "BAIXO", "OK", "EXCESSO"
    private String type;         // "PERECIVEL" ou "NAO_PERECIVEL"
    
}
