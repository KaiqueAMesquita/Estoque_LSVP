package com.lsvp.InventoryManagement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsvp.InventoryManagement.dto.Kitchen.KitchenUnitDTO;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IUnitMapper;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;


@Service
public class KitchenService {

    @Autowired
    private IUnitRepository unitRepository;

    @Autowired
    private IContainerRepository containerRepository;

    @Autowired
    private IUnitMapper unitMapper;


    private Container getKitchenContainer() {
        return containerRepository.findByType(ContainerType.PREPARACAO)
                .orElseThrow(() -> new ResourceNotFoundException("Container do tipo Preparação (Cozinha) não encontrado!"));
    }   

    @Transactional(readOnly = true)
    public Page<KitchenUnitDTO> getKitchenUnits(int page, int limit) {
        Container kitchen = getKitchenContainer();
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Unit> unitsPage = unitRepository.findByContainerAndQuantityGreaterThan(kitchen, 0, pageable);
        List<KitchenUnitDTO> dtos = unitsPage.stream().map(unitMapper::toKitchenUnitDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, unitsPage.getTotalElements());
    }


    @Transactional(readOnly = true)
    public Page<KitchenUnitDTO> getExpiringSoonUnits(int thresholdDays, int page, int limit) {
        Container kitchen = getKitchenContainer();
        Pageable pageable = PageRequest.of(page - 1, limit);
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(thresholdDays);
        Page<Unit> unitsPage = unitRepository.findByContainerAndQuantityGreaterThanAndExpirationDateBetween(
                kitchen, 0, today, endDate, pageable
        );
        List<KitchenUnitDTO> dtos = unitsPage.stream().map(unitMapper::toKitchenUnitDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, unitsPage.getTotalElements());
    }


}
