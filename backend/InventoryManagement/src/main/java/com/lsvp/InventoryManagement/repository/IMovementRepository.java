package com.lsvp.InventoryManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.enums.MovementType;

public interface IMovementRepository extends JpaRepository <Movement, Long> {

	Page<Movement> findByType(MovementType type, Pageable pageable);

	Page<Movement> findByTypeAndUnit_Id(MovementType type, Long unitId, Pageable pageable);

	Page<Movement> findByTypeAndDestiny(MovementType type, String destiny, Pageable pageable);

	Page<Movement> findByTypeAndUnit_IdAndDestiny(MovementType type, Long unitId, String destiny, Pageable pageable);

	
	Page<Movement> findByTypeAndDestinyIn(MovementType type, java.util.List<String> destinies, Pageable pageable);

	Page<Movement> findByTypeAndDestinyInAndUnit_Id(MovementType type, java.util.List<String> destinies, Long unitId, Pageable pageable);

}
