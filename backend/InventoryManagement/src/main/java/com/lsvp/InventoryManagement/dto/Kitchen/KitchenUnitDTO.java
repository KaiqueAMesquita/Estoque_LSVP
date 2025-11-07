package com.lsvp.InventoryManagement.dto.Kitchen;

import java.time.LocalDate;

import lombok.Data;

@Data
public class KitchenUnitDTO {
    private Long unitId;
    private Long productId;
    private String productName; // Nome/Descrição da Categoria do Produto
    private String productGtin;
    private String batch;
    private int quantity; // Quantidade restante na unidade
    private LocalDate expirationDate;
}
