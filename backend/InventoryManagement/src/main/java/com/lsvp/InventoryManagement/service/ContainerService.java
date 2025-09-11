package com.lsvp.InventoryManagement.service;


import com.lsvp.InventoryManagement.dto.Container.ContainerCreateDTO;
import com.lsvp.InventoryManagement.dto.Container.ContainerDTO;
import com.lsvp.InventoryManagement.dto.Container.ContainerUpdateDTO;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IContainerMapper;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContainerService {

    @Autowired
    private IContainerRepository repository;

    @Autowired
    private IContainerMapper mapper;

    public ContainerDTO createContainer(ContainerCreateDTO dto){

        Container container = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(container));

    }

    @Transactional
    public List<ContainerDTO> getAllContainers(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ContainerDTO getContainerById(Long id){

        Container container = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conteiner não encontrado!!"));

        return mapper.toDTO(container);
    }

    public ContainerDTO updateContainer(Long id, ContainerUpdateDTO dto){
        Container containerUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conteiner não encontrado!!"));

        containerUpdated.setCode(dto.getCode());

        return mapper.toDTO(repository.save(containerUpdated));

    }

    public void deleteContainer(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Container não encontrado!!"));

        repository.deleteById(id);
    }
}
