package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.Movement.InputCreateDTO;
import com.lsvp.InventoryManagement.dto.Unit.*;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IUnitMapper;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnitService {

    @Autowired
    private IUnitRepository repository;

    @Autowired
    private IUnitMapper mapper;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IContainerRepository containerRepository;

    @Transactional
    public Unit createOrUpdateUnit(InputCreateDTO dto, Product product, Container container){

        Optional<Unit> existingUnitOp = repository.findByProductIdAndBatch(dto.getProductId(), dto.getBatch());

        if(existingUnitOp.isPresent()){
            Unit existingUnit = existingUnitOp.get();

            int newQ = existingUnit.getQuantity() + dto.getQuantity();

            existingUnit.setQuantity(newQ);

            return repository.save(existingUnit);
        }
        else{

            Unit newUnit = mapper.fromInputDTO(dto, product, container);

            return repository.save(newUnit);
        }
    }

    public UnitDTO getUnitById(Long id){
        Unit unit = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!!"));

        return mapper.toDTO(unit);
    }

    public List<UnitDTO> getAllUnits(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public UnitDTO updateUnit(Long id, UnitUpdateDTO dto){
    //     //Gustavo: findById retorna Optionl<User>, sendo obrigatório a tratar caso o usuario não seja encontrado.
            Unit unitUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade nao encontrada!!"));

            unitUpdated.setBatch(dto.getBatch());
            unitUpdated.setExpiration_date(dto.getExpiration_date());
    //     
            unitUpdated.setPrice(dto.getPrice());

            return mapper.toDTO(repository.save(unitUpdated));
    }

    public void deleteUnit(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrado!!"));

        repository.deleteById(id);


    }

}
