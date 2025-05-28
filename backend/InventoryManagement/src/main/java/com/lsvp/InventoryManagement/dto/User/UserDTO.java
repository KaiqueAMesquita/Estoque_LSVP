package com.lsvp.InventoryManagement.dto.User;

import com.lsvp.InventoryManagement.enums.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    // Lucas: Adicionei o atributo password no DTO
    private Role role;
}
