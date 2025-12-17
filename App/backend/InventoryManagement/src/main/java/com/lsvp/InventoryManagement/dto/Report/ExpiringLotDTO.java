package com.lsvp.InventoryManagement.dto.Report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpiringLotDTO {
    private Long unitId;
    private String unitCode; // O código inteligente que criamos
    private String batch;
    private Long productId;
    private String productName;
    private String productGtin;
    private String containerCode; // Onde ele está guardado
    private int quantity; // Quantidade restante no lote
    private LocalDate expirationDate;
    private long daysUntilExpiry; // Quantos dias faltam
}
