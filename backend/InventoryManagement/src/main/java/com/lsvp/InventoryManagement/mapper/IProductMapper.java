package com.lsvp.InventoryManagement.mapper;

import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductSummaryDTO;
import com.lsvp.InventoryManagement.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IProductMapper {

    Product toEntity(ProductCreateDTO dto);

    @Mapping(source = "category.description", target = "description")
    ProductDTO toDTO(Product product);

    ProductSummaryDTO toSummary(Product product);
}
