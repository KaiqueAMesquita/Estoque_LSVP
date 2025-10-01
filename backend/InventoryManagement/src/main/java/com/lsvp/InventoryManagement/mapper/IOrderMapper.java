package com.lsvp.InventoryManagement.mapper;

import org.mapstruct.Mapper;

import com.lsvp.InventoryManagement.dto.Order.*;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Order;

@Mapper(componentModel = "spring")
public interface IOrderMapper {

    Order toEntity(OrderCreateDTO dto);

    OrderDTO toDTO(Order order);

}
