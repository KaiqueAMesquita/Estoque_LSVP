package com.lsvp.InventoryManagement.dto.User;

import com.lsvp.InventoryManagement.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

@Schema(description = "DTO para atualização de usuários")
public class UserUpdateDTO {


    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "Senha opcional")
    private String password;

    private Role role;

}
