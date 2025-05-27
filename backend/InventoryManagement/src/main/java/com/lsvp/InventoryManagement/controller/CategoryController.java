package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.service.CategoryService;
import com.lsvp.InventoryManagement.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Categorias", description = "Gerenciamento de categorias")

@RequestMapping("api/category")
public class CategoryController {
    private CategoryService categoryService;
}
