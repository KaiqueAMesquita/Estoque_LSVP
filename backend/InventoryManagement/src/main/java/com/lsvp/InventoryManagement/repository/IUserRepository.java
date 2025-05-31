package com.lsvp.InventoryManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lsvp.InventoryManagement.entity.User;

import java.util.Optional;

// Lucas: Alterei o nome de UserRepository para IUserRepository
// para manter o padrão de nomenclatura de interfaces
public interface IUserRepository extends JpaRepository<User, Long> {
     void deleteById(Long id);

     Optional<User> findByName(String username);
}
