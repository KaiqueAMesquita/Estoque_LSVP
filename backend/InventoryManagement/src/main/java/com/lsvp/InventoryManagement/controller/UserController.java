package com.lsvp.InventoryManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import com.lsvp.InventoryManagement.service.UserService;
import com.lsvp.InventoryManagement.dto.UserCreateDTO;
import com.lsvp.InventoryManagement.dto.UserDTO;

@RestController
// Lucas: Alterei o final da rota de users para user
// para usá-la como padrão em tudo que seja relativo ao usuário
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserCreateDTO dto){
        return ResponseEntity.ok(userService.createUser(dto));
    }
}
