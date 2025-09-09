package com.lsvp.InventoryManagement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lsvp.InventoryManagement.dto.Movement.InputCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.dto.Unit.*;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.Unit;

@Mapper(componentModel = "spring")
public interface IUnitMapper {
    Unit toEntity(UnitCreateDTO dto);

    @Mapping(source = "container.code", target = "containerCode")
    @Mapping(source = "product.category.description", target = "description")
    @Mapping(source = "product.gtin", target = "gtin")
    UnitDTO toDTO(Unit unit);
    
    @Mapping(target = "id", ignore = true)
    Unit fromInputDTO(InputCreateDTO dto, Product product, Container container);

    UnitSummaryDTO toSummary(Unit unit);
}
