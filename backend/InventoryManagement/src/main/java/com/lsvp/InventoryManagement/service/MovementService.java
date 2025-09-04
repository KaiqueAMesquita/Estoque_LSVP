package com.lsvp.InventoryManagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IMovementMapper;
import com.lsvp.InventoryManagement.repository.IMovementRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;
import com.lsvp.InventoryManagement.repository.IUserRepository;

import jakarta.transaction.Transactional;

@Service
public class MovementService {

    @Autowired
    private IMovementRepository repository;

    @Autowired
    private IMovementMapper mapper;

    @Autowired
    private IUnitRepository unitRepository;

    @Autowired
    private IUserRepository userRepository;


    @Transactional
    public MovementDTO createMovement(MovementCreateDTO dto){
        
        Unit unit = unitRepository.findById(dto.getUnitId()).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!"));
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!"));

        Movement movement = mapper.toEntity(dto);

        movement.setDate(LocalDateTime.now());
        movement.setUnit(unit);
        movement.setUser(user);

        switch (dto.getType()) {
            case SAIDA:
                    if(unit.getQuantity() < dto.getQuantity()){
                        throw new ResourceNotFoundException("Estoque insuficiente!!");
                    }
                    unit.setQuantity(unit.getQuantity() - dto.getQuantity());
                    if(movement.getOrigin() == null && unit.getContainer() != null){
                        movement.setOrigin(unit.getContainer().getCode());
                    }
                break;
            
            case ENTRADA:
                    unit.setQuantity(unit.getQuantity() + dto.getQuantity());

                    if(movement.getDestiny() == null && unit.getContainer() != null){
                        movement.setDestiny(unit.getContainer().getCode());
                    }
                break;
        }

        unitRepository.save(unit);
        return mapper.toDTO(repository.save(movement));
    }

    public MovementDTO getMovementById(Long id){
        Movement movement = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Movimentação nao encontrada!!"));

        return mapper.toDTO(movement);
    }

    public List<MovementDTO> getAllMovements() {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }


}
