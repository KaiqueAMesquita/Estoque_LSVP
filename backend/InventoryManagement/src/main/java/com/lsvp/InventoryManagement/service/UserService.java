package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.UserUpdateDTO;
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

    public UserDTO updateUser(Long id, UserUpdateDTO dto){
        //findById retorna Optionl<User>, sendo obrigatório a tratar caso o usuario não seja encontrado.

        User userUpdated = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário nao encontrado!!"));

        userUpdated.setName(dto.getName());
        userUpdated.setRole(dto.getRole());

        //Se senha estiver preenchida atualiza-la, caso contrario mantém a mesma
        if(dto.getPassword() != null){
            userUpdated.setPassword(dto.getPassword());
        }

        return mapper.toDTO(repository.save(userUpdated));
    }
}
