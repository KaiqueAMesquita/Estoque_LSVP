package com.lsvp.InventoryManagement.service;


import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductUpdateDTO;
import com.lsvp.InventoryManagement.dto.User.UserDTO;
import com.lsvp.InventoryManagement.dto.User.UserUpdateDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IProductMapper;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

        Product product = mapper.toEntity(dto);

        product.setCreatedAt(LocalDateTime.now());
        
        //Procura categoria pelo id passado.
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!"));

        product.setCategory(category);
//        category.getProducts().add(product);
        
        return mapper.toDTO(repository.save(product));
    }

    @Transactional
    public ProductDTO getProductById(Long id){
        Product product = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado!!!"));

        return mapper.toDTO(product);
    }

    @Transactional
    public ProductDTO getProductByGtin(String gtin){
        Product product = repository.findByGtin(gtin).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado!!!"));

        return mapper.toDTO(product);
    }

    @Transactional
    public List<ProductDTO> getAllProducts(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public ProductDTO updateProduct(Long id, ProductUpdateDTO dto){
        //Gustavo: findById retorna Optionl<User>, sendo obrigatório a tratar caso o usuario não seja encontrado.
        Product productUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado!!"));

        productUpdated.setGtin(dto.getGtin());
        productUpdated.setMeasure(dto.getMeasure());
        productUpdated.setMeasureType(dto.getMeasureType());
        productUpdated.setUpdatedAt(LocalDateTime.now());

        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!"));
        
        productUpdated.setCategory(category);

        return mapper.toDTO(repository.save(productUpdated));
    }

    public void deleteProduct(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado!!"));

        repository.deleteById(id);


    }


}
