package com.lsvp.InventoryManagement.dto.ReportFile;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor 
public class DonationDetailDTO {

    private LocalDateTime date;
    private String categoryName;
    private String productDescription; // Nome/GTIN
    private String unitCode;
    private int quantity;
    private String sourceDetails; // Quem doou (se tiver info)

    
}
