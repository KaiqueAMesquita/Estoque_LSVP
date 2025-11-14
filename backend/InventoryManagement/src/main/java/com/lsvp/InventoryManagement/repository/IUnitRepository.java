package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Unit;

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

    boolean existsByCode(String code);

}
