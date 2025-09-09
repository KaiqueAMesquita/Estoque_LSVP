package com.lsvp.InventoryManagement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lsvp.InventoryManagement.dto.Movement.InputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.dto.Movement.OutputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.TransferCreateDTO;
import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.entity.User;

@Mapper(componentModel = "spring")
public interface IMovementMapper {

    @Mapping(source = "unit.id", target = "unitId")
    @Mapping(source = "unit.product.gtin", target = "unitProductGtin")
    @Mapping(source = "unit.batch", target = "unitBatch")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    MovementDTO toDTO(Movement movement);

    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "destiny", ignore = true)
    @Mapping(source = "dto.quantity", target = "quantity") 
    @Mapping(source = "newUnit", target = "unit")
    @Mapping(source = "user", target = "user")
    Movement fromInputDTO(InputCreateDTO dto, Unit newUnit, User user);

    @Mapping(target = "id", ignore = true) //Ignora id na criação
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "origin", ignore = true)
    @Mapping(source = "dto.quantity", target = "quantity")
    @Mapping(source = "unit", target = "unit")
    @Mapping(source = "user", target = "user")
    Movement fromOutputDTO(OutputCreateDTO dto, Unit unit, User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "date", ignore = true)//Data definida no service
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "origin", ignore = true)
    @Mapping(target = "destiny", ignore = true)
    @Mapping(source = "dto.quantity", target = "quantity")
    @Mapping(source = "unit", target = "unit")
    @Mapping(source = "user", target = "user")
    Movement fromTransferDTO(TransferCreateDTO dto, Unit unit, User user);

    Movement toEntity(MovementCreateDTO dto);
}
