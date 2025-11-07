package com.lsvp.InventoryManagement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lsvp.InventoryManagement.dto.Order.*;
import com.lsvp.InventoryManagement.dto.OrderItem.OrderItemDTO;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Order;
import com.lsvp.InventoryManagement.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface IOrderMapper {

    Order toEntity(OrderCreateDTO dto);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.category.description", target = "productName") // Assumindo que o nome do produto está na descrição da categoria
    @Mapping(source = "product.gtin", target = "productGtin")
    OrderItemDTO itemToDTO(OrderItem orderItem);

    @Mapping(source = "user.name", target = "userName")
    OrderDTO toDTO(Order order);

}
