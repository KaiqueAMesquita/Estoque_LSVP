package com.lsvp.InventoryManagement.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    // Lucas: Adicionei o atributo password no DTO
    private Integer role;
}
