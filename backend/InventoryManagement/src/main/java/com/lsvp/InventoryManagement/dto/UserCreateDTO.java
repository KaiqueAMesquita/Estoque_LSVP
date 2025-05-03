package com.lsvp.InventoryManagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateDTO {
    @NotBlank(message = "User name is required")
    private String name;

    @NotBlank(message = "Password is required")
    private String password;

    private Integer role;
}
