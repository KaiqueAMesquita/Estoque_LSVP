package com.lsvp.InventoryManagement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.entity.Movement;

@Mapper(componentModel = "spring")
public interface IMovementMapper {

    @Mapping(source = "unit.id", target = "unitId")
    @Mapping(source = "unit.product.gtin", target = "unitProductGtin")
    @Mapping(source = "unit.batch", target = "unitBatch")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    MovementDTO toDTO(Movement movement);

    Movement toEntity(MovementCreateDTO dto);
}
