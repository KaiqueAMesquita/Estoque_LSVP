package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.dto.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.CategoryDTO;
import com.lsvp.InventoryManagement.service.CategoryService;
import com.lsvp.InventoryManagement.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Categorias", description = "Gerenciamento de categorias")

@RequestMapping("api/category")
public class CategoryController {
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory (@Valid @RequestBody CategoryCreateDTO dto)
    {
        System.out.println(dto);
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }
}
