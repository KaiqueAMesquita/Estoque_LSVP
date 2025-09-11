package com.lsvp.InventoryManagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import com.lsvp.InventoryManagement.dto.Movement.InputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.dto.Movement.OutputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.TransferCreateDTO;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IMovementMapper;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IMovementRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
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

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IContainerRepository containerRepository;

    @Autowired
    private UnitService unitService;


    @Transactional
    public MovementDTO createInput(InputCreateDTO dto){
        
        Product product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado!!"));
        Container container = containerRepository.findById(dto.getContainerId()).orElseThrow(() -> new ResourceNotFoundException("Container não encontrado!!"));
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!"));

        Unit unit = unitService.createOrUpdateUnit(dto, product, container);

        Movement movement = mapper.fromInputDTO(dto, unit, user);

        movement.setDate(LocalDateTime.now());
        movement.setType(MovementType.ENTRADA);
        movement.setSourceType(dto.getSourceType());
        movement.setSourceDetails(dto.getSourceDetails());
        movement.setDestiny(container.getCode());

        // Setar os atributos das entidades pai?
//        movement.setUnit(unit);
//        movement.setUser(user);

        movement.setOrigin(null);

        return mapper.toDTO(repository.save(movement));
    }
    

    @Transactional
    public MovementDTO createOutput(OutputCreateDTO dto){

        Unit unit = unitRepository.findById(dto.getUnitId()).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!"));
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!"));

        if(unit.getQuantity() < dto.getQuantity()){
            throw new ResourceNotFoundException("Estoque insuficiente!!");
        }

        String origin = unit.getContainer().toString();

        unit.setQuantity(unit.getQuantity() - dto.getQuantity());
        unitRepository.save(unit);

        Movement movement = mapper.fromOutputDTO(dto, unit, user);
        movement.setDate(LocalDateTime.now());
        movement.setType(MovementType.SAIDA);
        movement.setOrigin(origin);

        return mapper.toDTO(repository.save(movement));
    }

    @Transactional
    public MovementDTO createTransfer(TransferCreateDTO dto){
        
        Unit unit = unitRepository.findById(dto.getUnitId()).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!!"));
        Container destinationContainer = containerRepository.findById(dto.getDestinyContainerId()).orElseThrow(() -> new ResourceNotFoundException("Container de destino não encontrado!!!"));
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!!"));

        String origin = unit.getContainer().getCode();

        unit.setContainer(destinationContainer);
        unitRepository.save(unit);

        Movement movement = mapper.fromTransferDTO(dto, unit, user);
        movement.setDate(LocalDateTime.now());
        movement.setType(MovementType.TRANSFERENCIA);
        movement.setOrigin(origin);
        movement.setDestiny(destinationContainer.getCode());

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
