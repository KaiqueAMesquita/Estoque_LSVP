package com.lsvp.InventoryManagement.dto.ReportFile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeneralStatsDTO {

    private double percentPerishable;
    private double percentNonPerishable;
    private long totalItems;

    
}
