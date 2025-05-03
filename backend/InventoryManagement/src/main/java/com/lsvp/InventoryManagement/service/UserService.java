package com.lsvp.InventoryManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lsvp.InventoryManagement.dto.UserCreateDTO;
import com.lsvp.InventoryManagement.dto.UserDTO;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.mapper.IUserMapper;
import com.lsvp.InventoryManagement.repository.IUserRepository;

@Service
public class UserService {
    @Autowired
    private IUserRepository repository;

    @Autowired
    private IUserMapper mapper;

    public UserDTO createUser(UserCreateDTO dto){
        User user = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(user));
    }
}
