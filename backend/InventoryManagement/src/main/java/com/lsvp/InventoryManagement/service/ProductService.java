package com.lsvp.InventoryManagement.service;


import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IProductMapper;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        //Procura categoria pelo id passado.
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!"));

        product.setCategory(category);

        return mapper.toDTO(repository.save(product));
    }
}
