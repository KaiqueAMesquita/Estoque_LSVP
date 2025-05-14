package com.lsvp.InventoryManagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

public class UserUpdateDTO {

    @NotBlank(message = "Id is required")
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String password;

    @NotBlank(message = "Role is required")
    private int role;

}
