package com.lsvp.InventoryManagement.controller.User;

import com.lsvp.InventoryManagement.dto.User.UserDTO;
import com.lsvp.InventoryManagement.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Usuários (paged)", description = "Listagem paginada de usuários")
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String name
    ){
        Page<UserDTO> result = userService.getUsersPaged(page, limit, name);
        return ResponseEntity.ok(result);
    }
}
