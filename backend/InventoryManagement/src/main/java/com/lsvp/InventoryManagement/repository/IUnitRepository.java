package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.dto.ReportFile.CategoryStockReportDTO;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.enums.ContainerType;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


public interface IUnitRepository extends JpaRepository<Unit, Long>  {

    //Função para buscar unidade pelo id do produto e pelo numero do lote
     Optional<Unit> findByProductIdAndBatch(Long productId, String batch);

     Optional<Unit> findByBatch(String batch);

     //Query pra contar produtos distintos na cozinha
    @Query("SELECT COUNT(DISTINCT u.product.id) FROM Unit u WHERE u.container = :container AND u.quantity > 0")
    long countDistinctProductsByContainerAndQuantityGreaterThan(@Param("container") Container container);

    // Para listar unidades na cozinha, por paginação
    Page<Unit> findByContainerAndQuantityGreaterThan(Container container, int quantity, Pageable pageable);

    // Para listar unidades perto da validade na cozinha, por paginação
    Page<Unit> findByContainerAndQuantityGreaterThanAndExpirationDateBetween(
            Container container, int quantity, LocalDate startDate, LocalDate endDate, Pageable pageable
    );

    // Paginação e filtros por produto e lote
    Page<Unit> findByProduct_Id(Long productId, Pageable pageable);

    Page<Unit> findByProduct_IdAndBatchContainingIgnoreCase(Long productId, String batch, Pageable pageable);

    Page<Unit> findByBatchContainingIgnoreCase(String batch, Pageable pageable);

    // Find units expiring within X days from today
    List<Unit> findByExpirationDateBetween(LocalDate startDate, LocalDate endDate);

    Page<Unit> findByContainer_TypeAndQuantityGreaterThanAndExpirationDateBetween(
            ContainerType containerType,
            int quantity,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );


    // 1. Soma total de itens no estoque
    @Query("SELECT COALESCE(SUM(u.quantity), 0) FROM Unit u WHERE u.container.type = :type")
    Long sumTotalQuantityByContainerType(@Param("type") ContainerType type);

    // 2. Soma total de itens vencendo em um intervalo
    @Query("SELECT COALESCE(SUM(u.quantity), 0) FROM Unit u " +
           "WHERE u.container.type = :type " +
           "AND u.expirationDate BETWEEN :startDate AND :endDate")
    Long sumExpiringQuantityByContainerType(
            @Param("type") ContainerType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Busca unidades DE UMA CATEGORIA, em um tipo de container, quantidade > 0, ordenado por validade
    List<Unit> findByProduct_Category_IdAndContainer_TypeAndQuantityGreaterThanOrderByExpirationDateAsc(
            Long categoryId, 
            ContainerType type, 
            int quantity
    );
    
    @Query("SELECT COALESCE(SUM(u.quantity), 0) FROM Unit u " +
           "WHERE u.product.category.id = :categoryId " +
           "AND u.container.type IN :types")
    Long sumQuantityByCategoryIdAndContainerTypes(
            @Param("categoryId") Long categoryId,
            @Param("types") List<ContainerType> types
    );
    
    @Query("SELECT new com.lsvp.InventoryManagement.dto.ReportFile.CategoryStockReportDTO(" +
           "c.description, " +
           "COALESCE(SUM(u.quantity), 0), " +
           "c.min_quantity, " +
           "c.max_quantity, " +
           "'CALCULAR', " + // Status calcularemos no Java
           "CAST(c.foodType AS string)) " + // Converte Enum para String
           "FROM Category c " +
           "LEFT JOIN c.products p " +
           "LEFT JOIN p.units u ON u.container.type = :containerType " + // Filtra local
           "GROUP BY c.id, c.description, c.min_quantity, c.max_quantity, c.foodType " +
           "ORDER BY c.description")
    List<CategoryStockReportDTO> getStockByCategoryAndContainerType(@Param("containerType") ContainerType type);

    Page<Unit> findByContainerId(Long containerId, Pageable pageable);

    // Query robusta para filtrar por tudo ao mesmo tempo (ou nada)
    @Query("SELECT u FROM Unit u WHERE " +
           "(:productId IS NULL OR u.product.id = :productId) AND " +
           "(:containerId IS NULL OR u.container.id = :containerId) AND " +
           "(:batch IS NULL OR LOWER(u.batch) LIKE LOWER(CONCAT('%', :batch, '%')))")
    Page<Unit> searchUnits(
            @Param("productId") Long productId,
            @Param("containerId") Long containerId,
            @Param("batch") String batch,
            Pageable pageable
    );
    
    boolean existsByCode(String code);

}

    


