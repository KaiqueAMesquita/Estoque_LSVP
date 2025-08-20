package com.lsvp.InventoryManagement.service;

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

import java.time.LocalDateTime;
import java.util.List;
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


    public UnitDTO createUnit(UnitCreateDTO dto){

        Unit unit = mapper.toEntity(dto);

        Container container = containerRepository.findById(dto.getContainerId()).orElseThrow(() -> new ResourceNotFoundException("Container não encontrada!!"));

        Product product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrada!!"));

        unit.setContainer(container);

        unit.setProduct(product);

        return mapper.toDTO(repository.save(unit));
    }

    public UnitDTO getUnitById(Long id){
        Unit unit = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!!"));

        return mapper.toDTO(unit);
    }

    public List<UnitDTO> getAllUnits(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public UnitDTO updateUnit(Long id, UnitUpdateDTO dto){
        //Gustavo: findById retorna Optionl<User>, sendo obrigatório a tratar caso o usuario não seja encontrado.
        Unit unitUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade nao encontrada!!"));

        unitUpdated.setBatch(dto.getBatch());
        unitUpdated.setExpiration_date(dto.getExpiration_date());
        unitUpdated.setQuantity(dto.getQuantity());
        unitUpdated.setPrice(dto.getPrice());

        Product product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrada!!"));
        
        Container container = containerRepository.findById(dto.getContainerId()).orElseThrow(() -> new ResourceNotFoundException("Container não encontrado!!"));
        
        unitUpdated.setProduct(product);
        unitUpdated.setContainer(container);

        return mapper.toDTO(repository.save(unitUpdated));
    }

    public void deleteUnit(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrado!!"));

        repository.deleteById(id);


    }

}
