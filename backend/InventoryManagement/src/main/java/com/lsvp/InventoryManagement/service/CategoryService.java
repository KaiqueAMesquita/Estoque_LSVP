package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.Category.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryDTO;
import com.lsvp.InventoryManagement.dto.Category.CategoryUpdateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.exceptions.BadRequestException;
import com.lsvp.InventoryManagement.exceptions.BusinessException;
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
        // Validação fail-fast dos dados de entrada
        if (dto == null) {
            throw new BadRequestException("Dados da categoria são obrigatórios.");
        }
        if (dto.getDescription() == null || dto.getDescription().isBlank()) {
            throw new BadRequestException("Descrição da categoria é obrigatória.");
        }
        if (dto.getFoodType() == null) {
            throw new BadRequestException("Tipo de alimento (foodType) é obrigatório.");
        }
        if (dto.getMin_quantity() < 0) {
            throw new BadRequestException("Quantidade mínima não pode ser negativa.");
        }
        if (dto.getMax_quantity() < 0) {
            throw new BadRequestException("Quantidade máxima não pode ser negativa.");
        }
        if (dto.getMin_quantity() > 0 && dto.getMax_quantity() > 0 && dto.getMin_quantity() > dto.getMax_quantity()) {
            throw new BusinessException("Quantidade mínima não pode ser maior que a quantidade máxima.");
        }

        Category category = mapper.toEntity(dto);

        ZoneId zone_id = ZoneId.of("America/Sao_Paulo");
        category.setCreatedAt(LocalDateTime.now(zone_id));

        return mapper.toDTO(repository.save(category));
    }

    @Transactional
    public CategoryDTO getCategoryById(Long id)
    {
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para busca de categoria.");
        }

        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada."));

        return mapper.toDTO(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories()
    {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public Page<CategoryDTO> getAllCategoriesSorted(int page, int limit, String sortParam, String description) {
        // Fail-fast para parâmetros de paginação
        if (page < 1) {
            throw new BadRequestException("Parâmetro 'page' inválido. Deve ser >= 1.");
        }
        if (limit < 1) {
            throw new BadRequestException("Parâmetro 'limit' inválido. Deve ser >= 1.");
        }

        String[] sortParts = sortParam != null ? sortParam.split(",") : new String[]{"id","desc"};
        String property = sortParts[0] == null || sortParts[0].isBlank() ? "id" : sortParts[0];
        Sort.Direction direction;
        try {
            direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                    ? Sort.Direction.ASC : Sort.Direction.DESC;
        } catch (Exception ex) {
            throw new BadRequestException("Parâmetro 'sort' inválido. Formato esperado: 'propriedade,asc|desc'.");
        }

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));

        Page<Category> pageResult;
        if (description != null && !description.isBlank()) {
            pageResult = repository.findByDescriptionContainingIgnoreCase(description.trim(), pageable);
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
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para busca de produtos da categoria.");
        }

        Category category = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada para o ID informado."));
        Set<Product> products = category.getProducts();

        if (products == null || products.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return products.stream().map(product_mapper::toDTO).collect(Collectors.toList());
    }
    
    public CategoryDTO updateCategory(Long id, CategoryUpdateDTO dto)
    {
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para atualização de categoria.");
        }
        if (dto == null) {
            throw new BadRequestException("Dados para atualização da categoria são obrigatórios.");
        }

        Category categoryUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada para o ID informado."));
        boolean changed = false;

        if (dto.getDescription() != null) {
            if (dto.getDescription().isBlank()) {
                throw new BadRequestException("Descrição não pode ser vazia.");
            }
            categoryUpdated.setDescription(dto.getDescription());
            changed = true;
        }

        if (dto.getFoodType() != null) {
            categoryUpdated.setFoodType(dto.getFoodType());
            changed = true;
        }

        if (dto.getMin_quantity() < 0) {
            throw new BadRequestException("Quantidade mínima não pode ser negativa.");
        }

        if (dto.getMax_quantity() < 0) {
            throw new BadRequestException("Quantidade máxima não pode ser negativa.");
        }

        // Como CategoryUpdateDTO usa primitivos, o valor padrão 0 indica 'não informado' neste serviço.
        int effectiveMin = (dto.getMin_quantity() >= 1) ? dto.getMin_quantity() : (categoryUpdated.getMin_quantity() != null ? categoryUpdated.getMin_quantity() : 0);
        int effectiveMax = (dto.getMax_quantity() >= 1) ? dto.getMax_quantity() : (categoryUpdated.getMax_quantity() != null ? categoryUpdated.getMax_quantity() : 0);

        if (effectiveMin > effectiveMax) {
            throw new BusinessException("Quantidade mínima não pode ser maior que a quantidade máxima.");
        }

        if (dto.getMin_quantity() >= 1) {
            categoryUpdated.setMin_quantity(dto.getMin_quantity());
            changed = true;
        }

        if (dto.getMax_quantity() >= 1) {
            categoryUpdated.setMax_quantity(dto.getMax_quantity());
            changed = true;
        }

        if (!changed) {
            throw new BadRequestException("Nenhum campo válido informado para atualização.");
        }

        ZoneId zone_id = ZoneId.of("America/Sao_Paulo");
        categoryUpdated.setUpdatedAt(LocalDateTime.now(zone_id));

        return mapper.toDTO(repository.save(categoryUpdated));
    }

    public void deleteCategory(Long id)
    {
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para exclusão de categoria.");
        }

        Category category = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada para o ID informado."));

        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new BusinessException("Categoria possui produtos associados e não pode ser excluída.");
        }

        repository.delete(category);
    }
}
