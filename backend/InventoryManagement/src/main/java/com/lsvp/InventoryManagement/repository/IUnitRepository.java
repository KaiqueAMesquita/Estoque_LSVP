package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Unit;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface IUnitRepository extends JpaRepository<Unit, Long>  {

    //Função para buscar unidade pelo id do produto e pelo numero do lote
     Optional<Unit> findByProductIdAndBatch(Long productId, String batch);

     Optional<Unit> findByBatch(String batch);
}
