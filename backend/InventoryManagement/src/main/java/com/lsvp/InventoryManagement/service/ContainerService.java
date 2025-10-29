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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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

    @Transactional(readOnly = true)
    public Page<ContainerDTO> getAllContainersSorted(int page, int limit, String sortParam, String code, String category) {
        if (page < 1) page = 1;
        String[] sortParts = sortParam.split(",");
        String property = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));
        Page<Container> pageResult;
        if (code != null && !code.isBlank()) {
            pageResult = repository.findByCodeContainingIgnoreCase(code, pageable);
        } else if (category != null && !category.isBlank()) {
            pageResult = repository.findByProductCategoryDescriptionContainingIgnoreCase(category, pageable);
        } else {
            pageResult = repository.findAll(pageable);
        }
        List<ContainerDTO> dtos = pageResult.stream().map(mapper::toDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, pageResult.getTotalElements());
    }

    @Transactional
    public ContainerDTO getContainerById(Long id){

        Container container = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conteiner não encontrado!!"));

        return mapper.toDTO(container);
    }

    public ContainerDTO updateContainer(Long id, ContainerUpdateDTO dto){
        Container containerUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conteiner não encontrado!!"));

        containerUpdated.setCode(dto.getCode());
        containerUpdated.setDescription(dto.getDescription());
        containerUpdated.setType(dto.getType());

        return mapper.toDTO(repository.save(containerUpdated));

    }

    public void deleteContainer(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Container não encontrado!!"));

        repository.deleteById(id);
    }
}
