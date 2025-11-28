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

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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

            String uniqueCode;
            do {
                uniqueCode = generateSmartCode(product);
                
            } while (repository.existsByCode(uniqueCode));
            
            
            newUnit.setCode(uniqueCode);

            return repository.save(newUnit);
        }
    }

    private String generateSmartCode(Product product) {
        // 1. Prefixo da Categoria (3 primeiras letras)
        String categoryName = product.getCategory().getDescription();
        String catPrefix = (categoryName != null && categoryName.length() >= 3) 
            ? categoryName.substring(0, 3).toUpperCase() 
            : "GEN"; // Fallback se não tiver descrição

        // 2. Parte do GTIN (4 últimos dígitos)
        String gtin = product.getGtin();
        String gtinPart = (gtin != null && gtin.length() >= 4) 
            ? gtin.substring(gtin.length() - 4) 
            : "0000";

        // 3. Sufixo Aleatório (3 caracteres A-Z, 0-9)
        String randomSuffix = generateRandomSuffix(4);

        return String.format("%s-%s-%s", catPrefix, gtinPart, randomSuffix);
    }

    private String generateRandomSuffix(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random rnd = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @Transactional
    public UnitDTO getUnitById(Long id){
        Unit unit = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!!"));

        return mapper.toDTO(unit);
    }

    @Transactional
    public UnitDTO getUnitByBatch(String batch){
        Unit unit = repository.findByBatch(batch).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada!!!"));

        return mapper.toDTO(unit);
    }

    @Transactional
    public List<UnitDTO> getAllUnits(){
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true) // Boa prática: readOnly=true para buscas
    public Page<UnitDTO> getAllUnitsSorted(int page, int limit, String sortParam, Long productId, String code, Long containerId) {
        
        if (page < 1) page = 1;

        String[] sortParts = (sortParam != null && !sortParam.isBlank()) ? sortParam.split(",") : new String[]{"id","desc"};
        String property = sortParts[0];
        
        // Pequena correção: Se o front mandar "expiration_date" (snake), converte para "expirationDate" (camel) para o JPA não quebrar
        if ("expiration_date".equals(property)) property = "expirationDate";

        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));

        // --- AQUI MUDA: Chamamos a query inteligente ---
        // Passamos todos os parâmetros. O que for null, a query ignora.
        Page<Unit> pageResult = repository.searchUnits(productId, containerId, code, pageable);

        List<UnitDTO> dtos = pageResult.stream().map(mapper::toDTO).collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, pageResult.getTotalElements());
    }

    

    @Transactional
    public UnitDTO updateUnit(Long id, UnitUpdateDTO dto){
    //     //Gustavo: findById retorna Optionl<User>, sendo obrigatório a tratar caso o usuario não seja encontrado.
            Unit unitUpdated = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade nao encontrada!!"));

            unitUpdated.setBatch(dto.getBatch());
            unitUpdated.setExpirationDate(dto.getExpiration_date());
    //     
            unitUpdated.setPrice(dto.getPrice());

            return mapper.toDTO(repository.save(unitUpdated));
    }

    public void deleteUnit(Long id){
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrado!!"));

        repository.deleteById(id);


    }

    

}
