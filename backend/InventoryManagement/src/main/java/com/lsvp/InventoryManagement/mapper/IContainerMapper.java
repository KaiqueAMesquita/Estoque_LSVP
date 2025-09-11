package com.lsvp.InventoryManagement.mapper;


import com.lsvp.InventoryManagement.dto.Container.*;
import com.lsvp.InventoryManagement.entity.Container;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IContainerMapper {

    Container toEntity(ContainerCreateDTO dto);

    ContainerDTO toDTO(Container container);
}
