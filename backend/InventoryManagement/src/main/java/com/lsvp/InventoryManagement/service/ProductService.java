package com.lsvp.InventoryManagement.service;


import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductUpdateDTO;
import com.lsvp.InventoryManagement.dto.User.UserDTO;
import com.lsvp.InventoryManagement.dto.User.UserUpdateDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.exceptions.BadRequestException;
import com.lsvp.InventoryManagement.exceptions.BusinessException;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IProductMapper;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    @Autowired
    private IProductRepository repository;

    @Autowired
    private IProductMapper mapper;

    @Autowired
    private ICategoryRepository categoryRepository;


    public ProductDTO createProduct(ProductCreateDTO dto){
        // Fail-fast: validar DTO
        if (dto == null) {
            throw new BadRequestException("Dados do produto são obrigatórios.");
        }
        if (dto.getGtin() == null || dto.getGtin().isBlank()) {
            throw new BadRequestException("GTIN do produto é obrigatório.");
        }
        if (dto.getMeasure() == null) {
            throw new BadRequestException("Medida do produto é obrigatória.");
        }
        if (dto.getMeasure().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Medida do produto deve ser maior que zero.");
        }
        if (dto.getMeasureType() == null) {
            throw new BadRequestException("Tipo de medida do produto é obrigatório.");
        }
        if (dto.getCategoryId() == null || dto.getCategoryId() <= 0) {
            throw new BadRequestException("ID de categoria inválido.");
        }

        // Verificar unicidade do GTIN (regra de negócio)
        repository.findByGtin(dto.getGtin()).ifPresent(p -> {
            throw new BusinessException("Já existe um produto cadastrado com o GTIN informado.");
        });

        Product product = mapper.toEntity(dto);

        product.setCreatedAt(LocalDateTime.now());
        
        //Procura categoria pelo id passado.
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada para o ID informado."));

        product.setCategory(category);
//        category.getProducts().add(product);
        
        return mapper.toDTO(repository.save(product));
    }

    @Transactional
    public ProductDTO getProductById(Long id){
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para busca de produto.");
        }
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));

        return mapper.toDTO(product);
    }

    @Transactional
    public ProductDTO getProductByGtin(String gtin){
        if (gtin == null || gtin.isBlank()) {
            throw new BadRequestException("GTIN inválido para busca de produto.");
        }
        Product product = repository.findByGtin(gtin)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com GTIN informado não encontrado."));

        return mapper.toDTO(product);
    }

    @Transactional
    public List<ProductDTO> getAllProducts(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProductsSorted(int page, int limit, String sortParam, String gtin, String category) {
        if (page < 1) {
            throw new BadRequestException("Parâmetro 'page' inválido. Deve ser >= 1.");
        }
        if (limit < 1) {
            throw new BadRequestException("Parâmetro 'limit' inválido. Deve ser >= 1.");
        }

        String[] sortParts = (sortParam != null) ? sortParam.split(",") : new String[]{"id","desc"};
        String property = (sortParts.length > 0 && sortParts[0] != null && !sortParts[0].isBlank()) ? sortParts[0] : "id";
        Sort.Direction direction;
        try {
            direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                    ? Sort.Direction.ASC : Sort.Direction.DESC;
        } catch (Exception ex) {
            throw new BadRequestException("Parâmetro 'sort' inválido. Formato esperado: 'propriedade,asc|desc'.");
        }

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));

        Page<Product> pageResult;

        if (gtin != null && !gtin.isBlank()) {
            pageResult = repository.findByGtin(gtin.trim(), pageable);
        } else if (category != null && !category.isBlank()) {
            pageResult = repository.findByCategory_DescriptionContainingIgnoreCase(category.trim(), pageable);
        } else {
            pageResult = repository.findAll(pageable);
        }

        List<ProductDTO> dtos = pageResult.stream().map(mapper::toDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, pageResult.getTotalElements());
    }

    public ProductDTO updateProduct(Long id, ProductUpdateDTO dto){
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para atualização de produto.");
        }
        if (dto == null) {
            throw new BadRequestException("Dados para atualização do produto são obrigatórios.");
        }

        Product productUpdated = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado para o ID informado."));

        if (dto.getGtin() == null || dto.getGtin().isBlank()) {
            throw new BadRequestException("GTIN do produto é obrigatório para atualização.");
        }

        // Verificar se existe outro produto com o mesmo GTIN
        repository.findByGtin(dto.getGtin()).ifPresent(existing -> {
            if (!Objects.equals(existing.getId(), id)) {
                throw new BusinessException("Outro produto já está cadastrado com o GTIN informado.");
            }
        });

        productUpdated.setGtin(dto.getGtin());

        if (dto.getMeasure() != null) {
            if (dto.getMeasure().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Medida do produto deve ser maior que zero.");
            }
            productUpdated.setMeasure(dto.getMeasure());
        }

        if (dto.getMeasureType() != null) {
            productUpdated.setMeasureType(dto.getMeasureType());
        }

        if (dto.getCategoryId() == null || dto.getCategoryId() <= 0) {
            throw new BadRequestException("ID de categoria inválido para atualização.");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada para o ID informado."));
        productUpdated.setCategory(category);

        productUpdated.setUpdatedAt(LocalDateTime.now());

        return mapper.toDTO(repository.save(productUpdated));
    }

    public void deleteProduct(Long id){
        if (id == null || id <= 0) {
            throw new BadRequestException("ID inválido informado para exclusão de produto.");
        }

        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado para o ID informado."));

        if (product.getUnits() != null && !product.getUnits().isEmpty()) {
            throw new BusinessException("Produto possui unidades associadas e não pode ser excluído.");
        }

        repository.deleteById(id);


    }


}
