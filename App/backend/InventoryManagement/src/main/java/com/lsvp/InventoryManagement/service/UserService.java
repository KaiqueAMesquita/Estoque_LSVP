package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.User.UserUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;

import com.lsvp.InventoryManagement.config.PasswordConfig;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lsvp.InventoryManagement.dto.User.UserCreateDTO;
import com.lsvp.InventoryManagement.dto.User.UserDTO;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IUserMapper;
import com.lsvp.InventoryManagement.repository.IUserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class UserService {
    @Autowired
    private IUserRepository repository;

    @Autowired
    private IUserMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO createUser(UserCreateDTO dto){
        User user = mapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return mapper.toDTO(repository.save(user));
    }

    public UserDTO updateUser(Long id, UserUpdateDTO dto){
        //Gustavo: findById retorna Optionl<User>, sendo obrigatório a tratar caso o usuario não seja encontrado.

        User userUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário nao encontrado!!"));

        userUpdated.setName(dto.getName());
        userUpdated.setRole(dto.getRole());

        //Gustavo: Se senha estiver preenchida atualiza-la, caso contrario mantém a mesma
        if(dto.getPassword() != null){
            userUpdated.setPassword(dto.getPassword());
        }

        return mapper.toDTO(repository.save(userUpdated));
    }

    public void deleteUser(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!!"));

        repository.deleteById(id);
    }

    //Gustavo: Para controle de Status 404
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }


    //Gustavo: Get User por Id
    @Transactional
    public UserDTO getUserById(Long id){
        User user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!!"));

        return mapper.toDTO(user);
    }

    public UserDTO getUserByName(String name){
        User user = repository.findByName(name).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!!"));

        return mapper.toDTO(user);
    }

    //Gustavo: Get todos os Users
    //Gustavo: https://www.youtube.com/watch?v=3vYLwPzxJ2E
    @Transactional
    public List<UserDTO> getAllUsers(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }


    //https://fabiano-eprogramar.medium.com/api-rest-com-paginação-usando-spring-data-e-query-9eddb29c9223
    @Transactional
    public Page<UserDTO> getUsersPaged(int page, int limit, String name){
        if(page < 1) page = 1; // pages are 1-based in API
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<User> usersPage;
        if(name == null || name.isBlank()){
            usersPage = repository.findAll(pageable);
        } else {
            usersPage = repository.findByNameContainingIgnoreCase(name, pageable);
        }

        List<UserDTO> dtos = usersPage.stream().map(mapper::toDTO).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, usersPage.getTotalElements());
    }


}
