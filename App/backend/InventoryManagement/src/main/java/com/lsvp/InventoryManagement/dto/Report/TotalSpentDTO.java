package com.lsvp.InventoryManagement.dto.Report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalSpentDTO {
    private int month;
    private int year;
    private long totalSpent;
}
