package com.lsvp.InventoryManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lsvp.InventoryManagement.entity.User;

// Lucas: Alterei o nome de UserRepository para IUserRepository
// para manter o padrão de nomenclatura de interfaces
public interface IUserRepository extends JpaRepository<User, Long> {
    void deleteById(Long id);
}
