package com.lsvp.InventoryManagement.service.Report;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsvp.InventoryManagement.dto.Category.CategoryTotalStockDTO;
import com.lsvp.InventoryManagement.dto.Dashboard.ExpiringProductsTotalDTO;
import com.lsvp.InventoryManagement.dto.Dashboard.TotalStockDTO;
import com.lsvp.InventoryManagement.dto.Report.AveragePriceDTO;
import com.lsvp.InventoryManagement.dto.Report.ExpiringLotDTO;
import com.lsvp.InventoryManagement.dto.Report.MonthlyStockFlowDTO;
import com.lsvp.InventoryManagement.dto.Report.TotalSpentDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.CategorySourceReportDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.CategoryStockReportDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.GeneralStatsDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.RiskAnalysisDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.SourceComparasionDTO;
import com.lsvp.InventoryManagement.dto.ReportFile.StockCoverageDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.enums.ProductSource;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IMovementRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;
import com.lsvp.InventoryManagement.service.Report.PdfService;



@Service
public class ReportService {

    @Autowired
    private IUnitRepository unitRepository;

    @Autowired
    private IMovementRepository movementRepository;


    @Autowired 
    private ICategoryRepository categoryRepository
    ;

    @Autowired
    private PdfService pdfService;

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

    @Transactional(readOnly = true)
    public CategoryTotalStockDTO getTotalStockByCategory(Long categoryId) {
        
        List<ContainerType> validTypes = Arrays.asList(
                ContainerType.ESTOQUE, 
                ContainerType.PREPARACAO
        );

        Long total = unitRepository.sumQuantityByCategoryIdAndContainerTypes(categoryId, validTypes);

        return new CategoryTotalStockDTO(categoryId, total);
    }



    public Pair<List<CategoryStockReportDTO>, GeneralStatsDTO> getStockPositionData(ContainerType type) {
        List<CategoryStockReportDTO> list = unitRepository.getStockByCategoryAndContainerType(type);
        
        long totalItems = 0;
        long totalPerishable = 0;

        for (CategoryStockReportDTO item : list) {
           if (type == ContainerType.ESTOQUE) {
                // Lógica de Estoque (Usa Mínimo e Máximo)
                if (item.getMinQuantity() != null && item.getCurrentQuantity() < item.getMinQuantity()) {
                    item.setStatus("CRÍTICO");
                } else if (item.getMaxQuantity() != null && item.getCurrentQuantity() > item.getMaxQuantity()) {
                    item.setStatus("EXCESSO");
                } else {
                    item.setStatus("OK");
                }
            } else {
                // Lógica de Cozinha (Ignora Mín/Máx do cadastro)
              
                item.setMinQuantity(null);
                item.setMaxQuantity(null);

                if (item.getCurrentQuantity() > 0) {
                    item.setStatus("DISPONÍVEL");
                } else {
                    item.setStatus("-"); // Ou "ZERADO"
                }
            }

            // Estatísticas
            totalItems += item.getCurrentQuantity();
            if ("PERECIVEL".equals(item.getType())) {
                totalPerishable += item.getCurrentQuantity();
            }
        }

        double pctPer = (totalItems > 0) ? (double) totalPerishable / totalItems * 100 : 0;
        double pctNon = 100.0 - pctPer;

        GeneralStatsDTO stats = new GeneralStatsDTO(pctPer, pctNon, totalItems);
        
        // Retorna um par (Lista + Estatísticas) - *Pode usar uma classe wrapper customizada se não tiver Pair
        return Pair.of(list, stats); 
    }

    // 1. Relatório de Cobertura (Days of Supply)
    public byte[] generateCoverageReportPdf() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        // 1. Busca TUDO que tem consumo (Cria um Mapa para busca rápida)
        List<Object[]> consumptionData = movementRepository.sumConsumptionLast30DaysByCategory(thirtyDaysAgo);
        Map<Long, Double> consumptionMap = new HashMap<>();
        
        for (Object[] row : consumptionData) {
            Long catId = (Long) row[0];
            Long totalQtd = (Long) row[2];
            consumptionMap.put(catId, totalQtd / 30.0); // Guarda a média diária
        }

        // 2. Busca TODAS as categorias que têm estoque > 0
        // (Ou use categoryRepository.findAll() se quiser mostrar até o que está zerado)
        List<CategoryStockReportDTO> allStock = unitRepository.getStockByCategoryAndContainerType(ContainerType.ESTOQUE); 
        // Nota: A query getStockByCategoryAndContainerType que fizemos antes já traz tudo agrupado por categoria.
        // Se ela filtrar só o que tem estoque > 0, ótimo. Se trouxer tudo, melhor ainda pro relatório.

        List<StockCoverageDTO> reportData = new ArrayList<>();

        for (CategoryStockReportDTO catData : allStock) {
            // Se não tiver estoque nem na cozinha nem no almoxarifado e nem consumo, pode pular (opcional)
            // Mas vamos processar tudo que veio do banco.

            // Pega o ID da categoria (precisamos garantir que o DTO tenha o ID ou buscar de outra forma)
            // O DTO CategoryStockReportDTO atual não tem ID, só nome. 
            // Vamos precisar buscar pelo nome ou ajustar o DTO anterior.
            // SOLUÇÃO RÁPIDA: Vamos iterar sobre as Categories do banco direto para ser mais seguro.
        }
        
        // --- ABORDAGEM MAIS SEGURA (Refatoração do loop) ---
        List<Category> allCategories = categoryRepository.findAll();
        reportData.clear(); // Limpa pra garantir

        for (Category cat : allCategories) {
            Long categoryId = cat.getId();
            String catName = cat.getDescription();
            
            // Pega o consumo do mapa (se não tiver, é 0.0)
            double dailyAvg = consumptionMap.getOrDefault(categoryId, 0.0);

            // Pega o estoque atual TOTAL (Estoque + Cozinha)
            Long currentStock = unitRepository.sumQuantityByCategoryIdAndContainerTypes(
                categoryId, 
                Arrays.asList(ContainerType.ESTOQUE, ContainerType.PREPARACAO)
            );

            // Se não tem estoque e não tem consumo, não mostra no relatório pra não poluir
            if (currentStock == 0 && dailyAvg == 0) continue;

            // Cálculo de Dias
            int daysSupply = 0;
            String status = "SEM CONSUMO";
            
            if (dailyAvg > 0) {
                daysSupply = (int) (currentStock / dailyAvg);
                
                if (daysSupply < 5) status = "CRÍTICO";
                else if (daysSupply < 15) status = "BAIXO";
                else if (daysSupply < 45) status = "CONFORTÁVEL";
                else status = "EXCESSO";
            } else if (currentStock > 0) {
                status = "SEM SAÍDA (EXCESSO)"; // Tem estoque mas ninguém come
                daysSupply = 999;
            }

            reportData.add(new StockCoverageDTO(catName, currentStock, dailyAvg, daysSupply, status));
        }

        try {
            return pdfService.generateCoverageReport("Relatório de Cobertura de Estoque", reportData);
        } catch (IOException e) {
            throw new RuntimeException("Erro PDF", e);
        }
    }

    // 2. Relatório de Risco (Vencimento vs Consumo)
    public byte[] generateRiskReportPdf() {
        // Busca itens vencendo nos próximos 30 dias
        LocalDate today = LocalDate.now();
        LocalDate limitDate = today.plusDays(30);
        
        // (Reutilizando a lógica de busca de expiring lots)
        List<Unit> expiringUnits = unitRepository.findByExpirationDateBetween(today, limitDate); // Ajuste para sua query correta
        
        // Mapa de consumo médio por categoria para acesso rápido
        Map<Long, Double> avgConsumptionMap = new HashMap<>();
        List<Object[]> consumptionData = movementRepository.sumConsumptionLast30DaysByCategory(LocalDateTime.now().minusDays(30));
        for(Object[] row : consumptionData) {
            avgConsumptionMap.put((Long)row[0], ((Long)row[2]) / 30.0);
        }

        List<RiskAnalysisDTO> reportData = new ArrayList<>();

        for (Unit unit : expiringUnits) {
            Long catId = unit.getProduct().getCategory().getId();
            double dailyAvg = avgConsumptionMap.getOrDefault(catId, 0.0);
            
            long daysUntilExpiry = java.time.temporal.ChronoUnit.DAYS.between(today, unit.getExpirationDate());
            if (daysUntilExpiry < 0) daysUntilExpiry = 0;

            double estimatedConsumption = dailyAvg * daysUntilExpiry;
            double estimatedWaste = unit.getQuantity() - estimatedConsumption;

            // Só adiciona ao relatório se houver risco de desperdício (sobra > 0)
            if (estimatedWaste > 0) {
                String risk = (estimatedWaste > unit.getQuantity() * 0.5) ? "ALTO" : "MÉDIO";
                
                reportData.add(new RiskAnalysisDTO(
                    unit.getProduct().getCategory().getDescription() + " - " + unit.getProduct().getGtin(),
                    unit.getCode(),
                    unit.getExpirationDate(),
                    unit.getQuantity(),
                    estimatedConsumption,
                    estimatedWaste,
                    risk
                ));
            }
        }

        try {
            return pdfService.generateRiskReport("Análise de Risco de Desperdício", reportData);
        } catch (IOException e) {
            throw new RuntimeException("Erro PDF", e);
        }
    }

    // 3. Relatório Comparativo (Doação vs Compra)
    public byte[] generateSourceComparisonPdf(int month, int year) {
        LocalDateTime start = YearMonth.of(year, month).atDay(1).atStartOfDay();
        LocalDateTime end = YearMonth.of(year, month).atEndOfMonth().atTime(23, 59, 59);

        // 1. Busca dados brutos: [Categoria, Origem, Qtd]
        List<Object[]> rawData = movementRepository.sumEntriesByCategoryAndSource(start, end);

        // 2. Agrupa em um Mapa para facilitar: Map<Categoria, ListaDeDados>
        Map<String, List<SourceComparasionDTO>> groupedData = new HashMap<>();
        Map<String, Long> categoryTotals = new HashMap<>(); // Para calcular %

        for (Object[] row : rawData) {
            String catName = (String) row[0];
            String sourceType = row[1].toString();
            Long qtd = (Long) row[2];

            groupedData.putIfAbsent(catName, new ArrayList<>());
            groupedData.get(catName).add(new SourceComparasionDTO(sourceType, qtd, 0.0)); // % será calculada depois

            // Soma total da categoria
            categoryTotals.put(catName, categoryTotals.getOrDefault(catName, 0L) + qtd);
        }

        // 3. Monta a lista final calculando as porcentagens corretas
        List<CategorySourceReportDTO> reportData = new ArrayList<>();

        for (Map.Entry<String, List<SourceComparasionDTO>> entry : groupedData.entrySet()) {
            String catName = entry.getKey();
            List<SourceComparasionDTO> sources = entry.getValue();
            Long totalCat = categoryTotals.get(catName);

            // Calcula % para cada origem DENTRO desta categoria
            for (SourceComparasionDTO source : sources) {
                double pct = (totalCat > 0) ? (source.getTotalQuantity().doubleValue() / totalCat) * 100 : 0;
                source.setPercentage(pct);
            }

            reportData.add(new CategorySourceReportDTO(catName, sources));
        }

        try {
            return pdfService.generateSourceReport("Comparativo de Entradas por Categoria - " + month + "/" + year, reportData);
        } catch (IOException e) {
            throw new RuntimeException("Erro PDF", e);
        }
    }


    
}

