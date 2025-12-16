package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.dto.Category.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryUpdateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@Tag(name = "Categorias", description = "Gerenciamento de Categorias")

@RequestMapping("api/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ESTOQUISTA')")
    public ResponseEntity<CategoryDTO> createCategory (@Valid @RequestBody CategoryCreateDTO dto)
    {
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id)
    {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping
    public ResponseEntity<Page<CategoryDTO>> getAllcategories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String description
    )
    {
        Page<CategoryDTO> result = categoryService.getAllCategoriesSorted(page, limit, sort, description);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductDTO>> getProductsFromCategory(@PathVariable Long id)
    {
        return ResponseEntity.ok(categoryService.getProductsFromCategory(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ESTOQUISTA')")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, CategoryUpdateDTO dto)
    {
        return ResponseEntity.ok(categoryService.updateCategory(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ESTOQUISTA')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id)
    {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
