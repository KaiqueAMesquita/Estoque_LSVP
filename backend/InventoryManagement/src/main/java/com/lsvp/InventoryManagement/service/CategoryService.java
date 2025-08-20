package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.Category.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryDTO;
import com.lsvp.InventoryManagement.dto.Category.CategorySummaryDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryUpdateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.ICategoryMapper;
import com.lsvp.InventoryManagement.mapper.IProductMapper;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private ICategoryRepository repository;

    @Autowired
    private ICategoryMapper mapper;

    @Autowired
    private IProductMapper product_mapper;

    public CategoryDTO createCategory(CategoryCreateDTO dto)
    {
        Category category = mapper.toEntity(dto);

        ZoneId zone_id = ZoneId.of("America/Sao_Paulo");
        category.setCreated_at(LocalDateTime.now(zone_id));

        return mapper.toDTO(repository.save(category));
    }

    public CategoryDTO getCategoryById(Long id)
    {
        Category category = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!!"));

        return mapper.toDTO(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories()
    {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsFromCategory(Long id)
    {
        Category category = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!!"));
        Set<Product> products = category.getProducts();

        Set<ProductDTO> productsDTO = new java.util.HashSet<>(Set.of());
        products.forEach(product -> productsDTO.add(product_mapper.toDTO(product)));

        return productsDTO.stream().toList();
    }
    
    public CategoryDTO updateCategory(Long id, CategoryUpdateDTO dto)
    {
        Category categoryUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!!"));
        
        if(dto.getDescription() != "")
            categoryUpdated.setDescription(dto.getDescription());
        
        if(dto.getFood_type() != null)
            categoryUpdated.setFood_type(dto.getFood_type());

        ZoneId zone_id = ZoneId.of("America/Sao_Paulo");
        categoryUpdated.setUpdated_at(LocalDateTime.now(zone_id));

        return mapper.toDTO(repository.save(categoryUpdated));
    }

    public void deleteCategory(Long id)
    {
        Category category = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!!"));

        repository.delete(category);
    }
}
