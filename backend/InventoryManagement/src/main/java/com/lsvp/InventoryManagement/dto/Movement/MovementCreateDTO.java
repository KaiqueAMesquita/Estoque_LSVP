package com.lsvp.InventoryManagement.dto.Movement;

import com.lsvp.InventoryManagement.enums.MovementType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class MovementCreateDTO {
    private int quantity;
    private MovementType type;
    private String origin;
    private String destiny;
    private Long unitId;
    private Long userId;
}
