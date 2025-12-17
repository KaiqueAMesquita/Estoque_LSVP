package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.Category.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryDTO;
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
 
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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
        category.setCreatedAt(LocalDateTime.now(zone_id));

        return mapper.toDTO(repository.save(category));
    }

    @Transactional
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
    @Transactional(readOnly = true)
    public Page<CategoryDTO> getAllCategoriesSorted(int page, int limit, String sortParam, String description) {
        if (page < 1) page = 1;

        String[] sortParts = sortParam != null ? sortParam.split(",") : new String[]{"id","desc"};
        String property = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));

        Page<Category> pageResult;
        if (description != null && !description.isBlank()) {
            pageResult = repository.findByDescriptionContainingIgnoreCase(description, pageable);
        } else {
            pageResult = repository.findAll(pageable);
        }

        List<CategoryDTO> dtos = pageResult.stream().map(mapper::toDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, pageResult.getTotalElements());
    }

    // É necessário utilizar a notação @Transactional para métodos que quebram
    // por ConcurrentModification
    @Transactional
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
        
        if(!dto.getDescription().isEmpty())
            categoryUpdated.setDescription(dto.getDescription());
        
        if(dto.getFoodType() != null)
            categoryUpdated.setFoodType(dto.getFoodType());

        // Java não deixa comparar int com null
        if(dto.getMin_quantity() >= 1)
            categoryUpdated.setMin_quantity(dto.getMin_quantity());

        if(dto.getMax_quantity() >= 1)
            categoryUpdated.setMax_quantity(dto.getMax_quantity());

        ZoneId zone_id = ZoneId.of("America/Sao_Paulo");
        categoryUpdated.setUpdatedAt(LocalDateTime.now(zone_id));

        return mapper.toDTO(repository.save(categoryUpdated));
    }

    public void deleteCategory(Long id)
    {
        Category category = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!!"));

        repository.delete(category);
    }
}
