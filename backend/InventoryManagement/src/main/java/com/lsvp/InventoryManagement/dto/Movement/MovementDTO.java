package com.lsvp.InventoryManagement.dto.Movement;

import java.time.LocalDateTime;

import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.enums.ProductSource;

import lombok.Data;

@Data
public class MovementDTO {
    private Long id;
    private int quantity;
    private MovementType type;
    private String origin;
    private String destiny;
    private LocalDateTime date;

    private ProductSource sourceType;
    private String sourceDetails;


    //Campos de entidades relacionadas
    private Long unitId;
    private String unitProductGtin;
    private String unitBatch;
    private Long userId;
    private String userName;

    // Não faltam as entidades pai? Unit e User
//    private Unit unit;
//    private User user;
}
