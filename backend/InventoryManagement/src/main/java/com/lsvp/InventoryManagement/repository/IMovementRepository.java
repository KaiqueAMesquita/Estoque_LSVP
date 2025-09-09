package com.lsvp.InventoryManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lsvp.InventoryManagement.entity.Movement;

public interface IMovementRepository extends JpaRepository <Movement, Long> {

}
