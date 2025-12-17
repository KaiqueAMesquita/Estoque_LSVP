package com.lsvp.InventoryManagement.dto.User;

import com.lsvp.InventoryManagement.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Schema(description = "DTO para criação de usuário")
public class UserCreateDTO {

    //Adicionado Schema para o Swagger reconhecer automaticamente nas rotas


    @NotBlank(message = "User name is required")
    @Schema(description = "Nome do usuário", example = "José")
    private String name;

    @NotBlank(message = "Password is required")
    @Schema(description = "Senha do usuario", example = "jose123")
    private String password;

    @Schema(description = "Papel do usuário", example = "ADMINISTRADOR")
    @NotNull(message = "Role is required")
    private Role role;


}
