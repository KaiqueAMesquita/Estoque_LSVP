package com.lsvp.InventoryManagement.service.Report;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsvp.InventoryManagement.dto.Dashboard.ExpiringProductsTotalDTO;
import com.lsvp.InventoryManagement.dto.Dashboard.TotalStockDTO;
import com.lsvp.InventoryManagement.dto.Report.AveragePriceDTO;
import com.lsvp.InventoryManagement.dto.Report.ExpiringLotDTO;
import com.lsvp.InventoryManagement.dto.Report.MonthlyStockFlowDTO;
import com.lsvp.InventoryManagement.dto.Report.TotalSpentDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.enums.ProductSource;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IMovementRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;



@Service
public class ReportService {

    @Autowired
    private IUnitRepository unitRepository;

    @Autowired
    private IMovementRepository movementRepository;


    @Autowired 
    private ICategoryRepository categoryRepository
    ;
    /**
     * Retorna lotes paginados em ESTOQUE próximos de vencer.
     */
    @Transactional(readOnly = true)
    public Page<ExpiringLotDTO> getExpiringLots(int daysUntilExpiry, int page, int limit) {
        LocalDate today = LocalDate.now();
        LocalDate expiryLimitDate = today.plusDays(daysUntilExpiry);

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("expirationDate").ascending());

        Page<Unit> unitsPage = unitRepository.findByContainer_TypeAndQuantityGreaterThanAndExpirationDateBetween(
                ContainerType.ESTOQUE,
                0,
                today,
                expiryLimitDate,
                pageable
        );

        // Mapeamento manual para DTO
        List<ExpiringLotDTO> dtos = unitsPage.stream()
                .map(unit -> {
                    ExpiringLotDTO dto = new ExpiringLotDTO();
                    dto.setUnitId(unit.getId());
                    dto.setUnitCode(unit.getCode());
                    dto.setBatch(unit.getBatch());
                    dto.setQuantity(unit.getQuantity());
                    dto.setExpirationDate(unit.getExpirationDate());
                    dto.setDaysUntilExpiry(ChronoUnit.DAYS.between(today, unit.getExpirationDate()));

                    if (unit.getProduct() != null) {
                        dto.setProductId(unit.getProduct().getId());
                        dto.setProductGtin(unit.getProduct().getGtin());
                        if (unit.getProduct().getCategory() != null) {
                            dto.setProductName(unit.getProduct().getCategory().getDescription());
                        }
                    }
                    if (unit.getContainer() != null) {
                        dto.setContainerCode(unit.getContainer().getCode());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, unitsPage.getTotalElements());
    }

    /**
     * Retorna o valor total gasto (em centavos) em compras em um determinado mês/ano.
     */
    @Transactional(readOnly = true)
    public TotalSpentDTO getTotalSpentByMonth(int month, int year) {
        Long totalSpent = movementRepository.sumTotalSpentByMonth(
                MovementType.ENTRADA,
                ProductSource.COMPRA_PROPRIA,
                year,
                month
        );

        return new TotalSpentDTO(month, year, Optional.ofNullable(totalSpent).orElse(0L));
    }

    /**
     * Retorna o preço médio ponderado mensal para uma categoria.
     */
    @Transactional(readOnly = true)
    public List<AveragePriceDTO> getAveragePriceByCategory(Long categoryId, int startMonth, int startYear, int endMonth, int endYear) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!"));

        LocalDateTime startDate = YearMonth.of(startYear, startMonth).atDay(1).atStartOfDay();
        LocalDateTime endDate = YearMonth.of(endYear, endMonth).atEndOfMonth().atTime(23, 59, 59);

        List<Object[]> results = movementRepository.findMonthlyAveragePrice(categoryId, startDate, endDate);
        
        List<AveragePriceDTO> dtos = new ArrayList<>();
        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            Double avgPrice = (row[2] != null) ? ((Number) row[2]).doubleValue() : null;
            
            dtos.add(new AveragePriceDTO(categoryId, category.getDescription(), year, month, avgPrice));
        }
        return dtos;
    }

    /**
     * Retorna o fluxo de estoque mensal (Entrada/Saída) para uma categoria.
     * (Alternativa ao "Estoque Médio")
     */
    @Transactional(readOnly = true)
    public List<MonthlyStockFlowDTO> getMonthlyStockFlow(Long categoryId, int startMonth, int startYear, int endMonth, int endYear) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!"));
        
        LocalDateTime startDate = YearMonth.of(startYear, startMonth).atDay(1).atStartOfDay();
        LocalDateTime endDate = YearMonth.of(endYear, endMonth).atEndOfMonth().atTime(23, 59, 59);

        List<Object[]> results = movementRepository.findMonthlyStockFlow(categoryId, startDate, endDate);
        
        List<MonthlyStockFlowDTO> dtos = new ArrayList<>();
        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            Long totalIn = ((Number) row[2]).longValue();
            Long totalOut = ((Number) row[3]).longValue();
            
            dtos.add(new MonthlyStockFlowDTO(categoryId, category.getDescription(), year, month, totalIn, totalOut));
        }
        return dtos;
    }

    // Total geral do estoque, somente com o que esta em container type = Estoque
    @Transactional(readOnly = true)
    public TotalStockDTO getTotalStockInStorage() {
        // Apenas o que está no container do tipo ESTOQUE
        Long total = unitRepository.sumTotalQuantityByContainerType(ContainerType.ESTOQUE);
        return new TotalStockDTO(total);
    }

    // Total produtos acabando a validade
    @Transactional(readOnly = true)
    public ExpiringProductsTotalDTO getTotalExpiringSoon(int days) {
        LocalDate today = LocalDate.now();
        LocalDate limitDate = today.plusDays(days);

        Long total = unitRepository.sumExpiringQuantityByContainerType(
                ContainerType.ESTOQUE,
                today,
                limitDate
        );

        return new ExpiringProductsTotalDTO(total, days);
    }
}

