package com.lsvp.InventoryManagement.mapper;

import org.mapstruct.Mapper;

import com.lsvp.InventoryManagement.dto.User.UserCreateDTO;
import com.lsvp.InventoryManagement.dto.User.UserDTO;
import com.lsvp.InventoryManagement.entity.User;

@Mapper(componentModel = "spring")
// Lucas: Alterei o nome de UserMapper para IUserMapper
// para manter o padrão de nomenclatura de interfaces
public interface IUserMapper {

    User toEntity(UserCreateDTO dto);

    UserDTO toDTO(User user);

}
