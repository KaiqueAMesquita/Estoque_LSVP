package com.lsvp.InventoryManagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import com.lsvp.InventoryManagement.dto.Movement.ConsumptionCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.InputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.dto.Movement.OutputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.StockAdjustmentDTO;
import com.lsvp.InventoryManagement.dto.Movement.TransferCreateDTO;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.entity.OrderItem;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.exceptions.BusinessException;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IMovementMapper;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IMovementRepository;
import com.lsvp.InventoryManagement.repository.IOrderItemRepository;
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

    @Autowired
    private IOrderItemRepository orderItemRepository;


    //ENTRADA

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
    

    //SAIDA

    @Transactional
    public MovementDTO createOutput(OutputCreateDTO dto){

        Unit unit = unitRepository.findById(dto.getUnitId()).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!"));
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!"));
        Container container = containerRepository.findById(dto.getDestinationContainerId()).orElseThrow(() -> new ResourceNotFoundException("Container de destino não encontrado!!"));

        if(unit.getQuantity() < dto.getQuantity()){
            throw new BusinessException("Estoque insuficiente!!");
        }

        String origin = (unit.getContainer() != null) ? unit.getContainer().getCode() : "Estoque Geral";

        unit.setContainer(container);

        unit.setQuantity(unit.getQuantity() - dto.getQuantity());
        unitRepository.save(unit);

        Movement movement = mapper.fromOutputDTO(dto, unit, user);
        movement.setDate(LocalDateTime.now());
        movement.setType(MovementType.SAIDA);
        movement.setOrigin(origin);
        movement.setDestiny(container.getCode());
        

        //Logica para incrementar quantityFulfilled do Order Fulfill
        if (dto.getOrderItemId() != null) {
            
            OrderItem item = orderItemRepository.findById(dto.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item de pedido não encontrado! ID: " + dto.getOrderItemId()));
           
            int quantityNeeded = item.getQuantityRequested() - item.getQuantityFulfilled();

                if (dto.getQuantity() > quantityNeeded) {
                throw new BusinessException(
                    "A quantidade a ser atendida (" + dto.getQuantity() + ") excede a quantidade restante do pedido (" + quantityNeeded + ")."
                );
                }

            movement.setOrderItem(item);
            
            item.setQuantityFulfilled(item.getQuantityFulfilled() + dto.getQuantity());
            orderItemRepository.save(item); 
        }

        return mapper.toDTO(repository.save(movement));
    }


    //TRANSFERENCIA 


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



    //CONSUMO

    @Transactional
    public MovementDTO createConsumption(ConsumptionCreateDTO dto) {

        Unit unit = unitRepository.findById(dto.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!"));

        // Validação 1: Unidade está em local de preparação?
        if (unit.getContainer() == null || unit.getContainer().getType() != ContainerType.PREPARACAO) {
            throw new BusinessException("A unidade " + unit.getId() + " não está em uma localização de preparação (cozinha).");
        }

        // Validação 2: Quantidade suficiente?
        if (unit.getQuantity() < dto.getQuantityConsumed()) {
            throw new BusinessException("Quantidade insuficiente na unidade " + unit.getId() + ". Disponível: " + unit.getQuantity());
        }

        // Atualiza a quantidade da unidade
        unit.setQuantity(unit.getQuantity() - dto.getQuantityConsumed());
        unitRepository.save(unit);

        Movement movement = new Movement(); // Criado manualmente pois não há DTO de origem
        movement.setUnit(unit);
        movement.setUser(user);
        movement.setType(MovementType.CONSUMO);
        movement.setQuantity(dto.getQuantityConsumed());
        movement.setDate(LocalDateTime.now());
        movement.setOrigin(unit.getContainer().getCode()); // Origem é o código da cozinha
        movement.setDestiny(null); // Consumido

        return mapper.toDTO(repository.save(movement));
    }


    //AJUSTE

    @Transactional
    public MovementDTO createOutputAdjustment(StockAdjustmentDTO dto) {

        Unit unit = unitRepository.findById(dto.getUnitId())
            .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada! ID: " + dto.getUnitId()));
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado! ID: " + dto.getUserId()));

        if (unit.getQuantity() < dto.getQuantity()) {
            throw new BusinessException("Estoque insuficiente na unidade para realizar o ajuste.");
        }

        unit.setQuantity(unit.getQuantity() - dto.getQuantity());
        unitRepository.save(unit);

        Movement movement = new Movement(); // Criado manualmente
        movement.setQuantity(dto.getQuantity());
        movement.setUnit(unit);
        movement.setUser(user);
        movement.setDate(LocalDateTime.now());
        movement.setType(MovementType.SAIDA); // Ajuste de saída ainda é do tipo SAIDA
        movement.setDestiny(dto.getReason().toString()); // Usa o motivo como destino
        if (unit.getContainer() != null) {
            movement.setOrigin(unit.getContainer().getCode());
        }

        return mapper.toDTO(repository.save(movement));
    }


    // -------- ROTAS PADRÕES ---------- // 

    
    public MovementDTO getMovementById(Long id){
        Movement movement = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Movimentação nao encontrada!!"));

        return mapper.toDTO(movement);
    }

    public List<MovementDTO> getAllMovements() {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional()
    public Page<MovementDTO> getAllMovementsSorted(int page, int limit, String sortParam) {
        if (page < 1) page = 1;

        String[] sortParts = sortParam.split(",");
        String property = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));
        org.springframework.data.domain.Page<Movement> pageResult = repository.findAll(pageable);
        List<MovementDTO> dtos = pageResult.stream().map(mapper::toDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, pageResult.getTotalElements());
    }


}
