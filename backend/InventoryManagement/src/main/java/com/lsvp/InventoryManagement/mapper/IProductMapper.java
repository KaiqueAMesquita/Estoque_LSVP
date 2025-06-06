package com.lsvp.InventoryManagement.mapper;

import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IProductMapper {

    Product toEntity(ProductCreateDTO dto);

    ProductDTO toDTO(Product product);
}
