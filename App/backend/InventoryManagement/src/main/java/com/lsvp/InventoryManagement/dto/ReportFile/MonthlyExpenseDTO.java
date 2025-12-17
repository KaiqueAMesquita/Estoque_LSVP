package com.lsvp.InventoryManagement.dto.ReportFile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyExpenseDTO {

    private int month;
    private Long totalValue; // Valor em centavos

}
