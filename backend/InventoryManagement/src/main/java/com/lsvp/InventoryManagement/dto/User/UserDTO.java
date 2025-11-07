package com.lsvp.InventoryManagement.dto.User;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.enums.Role;
import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String name;
    // Lucas: Adicionei o atributo password no DTO
    private Role role;
    @JsonIgnore
    private Set<Movement> movements;
}
