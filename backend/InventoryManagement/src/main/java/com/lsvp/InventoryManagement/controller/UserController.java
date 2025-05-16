package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.dto.UserUpdateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//Estava importando o RequestBody errado ); Eu odeio minha vida

import io.swagger.v3.oas.annotations.media.Content;


import com.lsvp.InventoryManagement.service.UserService;
import com.lsvp.InventoryManagement.dto.UserCreateDTO;
import com.lsvp.InventoryManagement.dto.UserDTO;

@RestController
// Lucas: Alterei o final da rota de users para user
// para usá-la como padrão em tudo que seja relativo ao usuário
@Tag(name = "Usuários", description = "Gerenciamento de usuários")

@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO dto){
        System.out.println(dto);
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id,@Valid @RequestBody UserUpdateDTO dto){
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

}
