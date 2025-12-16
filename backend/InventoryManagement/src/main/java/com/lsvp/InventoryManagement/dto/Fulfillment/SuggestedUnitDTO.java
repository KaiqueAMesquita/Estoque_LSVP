package com.lsvp.InventoryManagement.dto.Fulfillment;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SuggestedUnitDTO {

    private Long unitId;            // ID da unidade física
    private String batch;           // Lote
    private LocalDate expirationDate; // Validade
    private int quantityToTake;     // Quanto pegar desta unidade
    private int availableInUnit;    // Quanto tem sobrando lá
    private String containerCode;   // Onde está (Localização)
    
    // Novo: Útil para saber a marca específica (ex: "Arroz Tio João") 
    // já que o pedido foi genérico ("Arroz")
    private String specificProductName;
    
}
