package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.enums.ContainerType;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IContainerRepository extends JpaRepository<Container, Long> {
    void deleteById(Long id);

    Optional<Container> findByCode(String code);

    Optional<Container> findByType(ContainerType type);
    
    // Paginação e filtros
    Page<Container> findByCodeContainingIgnoreCase(String code, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT DISTINCT c FROM Container c JOIN c.units u JOIN u.product p JOIN p.category cat WHERE LOWER(cat.description) LIKE LOWER(CONCAT('%', :category, '%'))")
    Page<Container> findByProductCategoryDescriptionContainingIgnoreCase(@org.springframework.data.repository.query.Param("category") String category, org.springframework.data.domain.Pageable pageable);
}
