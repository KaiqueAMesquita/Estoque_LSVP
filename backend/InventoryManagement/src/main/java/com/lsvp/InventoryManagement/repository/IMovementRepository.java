package com.lsvp.InventoryManagement.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.enums.ProductSource;

public interface IMovementRepository extends JpaRepository <Movement, Long> {

	Page<Movement> findByType(MovementType type, Pageable pageable);

	Page<Movement> findByTypeAndUnit_Id(MovementType type, Long unitId, Pageable pageable);

	Page<Movement> findByTypeAndDestiny(MovementType type, String destiny, Pageable pageable);

	Page<Movement> findByTypeAndUnit_IdAndDestiny(MovementType type, Long unitId, String destiny, Pageable pageable);

	
	Page<Movement> findByTypeAndDestinyIn(MovementType type, java.util.List<String> destinies, Pageable pageable);

	Page<Movement> findByTypeAndDestinyInAndUnit_Id(MovementType type, java.util.List<String> destinies, Long unitId, Pageable pageable);

    @Query("SELECT SUM(m.quantity * m.unit.price) FROM Movement m " +
           "WHERE m.type = :type " +
           "AND m.sourceType = :sourceType " +
           "AND EXTRACT(YEAR FROM m.date) = :year " +
           "AND EXTRACT(MONTH FROM m.date) = :month")
    Long sumTotalSpentByMonth(
            @Param("type") MovementType type,
            @Param("sourceType") ProductSource sourceType,
            @Param("year") int year,
            @Param("month") int month
    );

	/**
     * Calcula o preço médio ponderado mensal para ENTRADAS de uma categoria.
     * (Soma(qtd * preço) / Soma(qtd))
     */
    @Query("SELECT " +
           "  EXTRACT(YEAR FROM m.date) as year, " +
           "  EXTRACT(MONTH FROM m.date) as month, " +
           "  SUM(m.quantity * m.unit.price) / SUM(m.quantity) as avgPrice " +
           "FROM Movement m " +
           "WHERE m.unit.product.category.id = :categoryId " +
           "AND m.type = com.lsvp.InventoryManagement.enums.MovementType.ENTRADA " +
           "AND m.date BETWEEN :startDate AND :endDate " +
           "GROUP BY EXTRACT(YEAR FROM m.date), EXTRACT(MONTH FROM m.date) " +
           "ORDER BY year, month")
    List<Object[]> findMonthlyAveragePrice(
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

	/**
     * Calcula o fluxo de estoque mensal (Entradas vs Saídas Reais) para uma categoria.
     * Saídas Reais = Consumo + Ajustes (Avaria, Vencimento, Perda, etc.)
     * NÃO CONTA transferências para a cozinha como saída.
     */
    @Query("SELECT " +
           "  EXTRACT(YEAR FROM m.date) as year, " +
           "  EXTRACT(MONTH FROM m.date) as month, " +
           "  SUM(CASE WHEN m.type = com.lsvp.InventoryManagement.enums.MovementType.ENTRADA THEN m.quantity ELSE 0 END) as totalIn, " +
           "  SUM(CASE " +
           "    WHEN m.type = com.lsvp.InventoryManagement.enums.MovementType.CONSUMO THEN m.quantity " +
           "    WHEN m.type = com.lsvp.InventoryManagement.enums.MovementType.SAIDA " +
           "         AND m.destiny IN ('AVARIA', 'VENCIMENTO', 'AJUSTE_INVENTARIO', 'PERDA') THEN m.quantity " + // Só conta SAIDA se for ajuste
           "    ELSE 0 " +
           "  END) as totalOut " +
           "FROM Movement m " +
           "WHERE m.unit.product.category.id = :categoryId " +
           "AND m.date BETWEEN :startDate AND :endDate " +
           "GROUP BY EXTRACT(YEAR FROM m.date), EXTRACT(MONTH FROM m.date) " +
           "ORDER BY year, month")
    List<Object[]> findMonthlyStockFlow(
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );


    // Calcula média de consumo diário nos últimos 30 dias por Categoria
    @Query("SELECT c.id, SUM(m.quantity) / 30.0 " +
           "FROM Movement m " +
           "JOIN m.unit.product.category c " +
           "WHERE m.type = 'CONSUMO' " +
           "AND m.date >= :startDate " +
           "GROUP BY c.id")
    List<Object[]> getAverageDailyConsumptionByCategory(@Param("startDate") LocalDateTime startDate);
    
    // Calcula totais por Origem (Doação vs Compra) para o relatório 4
    @Query("SELECT m.sourceType, SUM(m.quantity) " +
           "FROM Movement m " +
           "WHERE m.type = 'ENTRADA' " +
           "AND m.date BETWEEN :start AND :end " +
           "GROUP BY m.sourceType")
    List<Object[]> getTotalsBySourceType(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Soma consumo dos últimos 30 dias por Categoria
    @Query("SELECT c.id, c.description, COALESCE(SUM(m.quantity), 0) " +
           "FROM Movement m " +
           "JOIN m.unit.product.category c " +
           "WHERE m.type = 'CONSUMO' " +
           "AND m.date >= :startDate " +
           "GROUP BY c.id, c.description")
    List<Object[]> sumConsumptionLast30DaysByCategory(@Param("startDate") LocalDateTime startDate);

    // Soma entradas por tipo de origem (Doação/Compra) em um período
    @Query("SELECT m.sourceType, COALESCE(SUM(m.quantity), 0) " +
           "FROM Movement m " +
           "WHERE m.type = 'ENTRADA' " +
           "AND m.date BETWEEN :start AND :end " +
           "GROUP BY m.sourceType")
    List<Object[]> sumEntriesBySourceType(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Agrupa entradas por Categoria E por Origem
    @Query("SELECT c.description, m.sourceType, COALESCE(SUM(m.quantity), 0) " +
           "FROM Movement m " +
           "JOIN m.unit.product.category c " +
           "WHERE m.type = 'ENTRADA' " +
           "AND m.date BETWEEN :start AND :end " +
           "GROUP BY c.description, m.sourceType " +
           "ORDER BY c.description")
    List<Object[]> sumEntriesByCategoryAndSource(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}


