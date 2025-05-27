package com.lsvp.InventoryManagement.entity;

import com.lsvp.InventoryManagement.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// Lucas:
// No código antigo, se importava o jakarta.validation.constraints.NotBlank
// Retirei por não precisarmos agora

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "us_id")
    private Long id;

    @Column(name = "us_name", length = 50, nullable = false)
    private String name;

    @Column(name = "us_password", length = 15, nullable = false)
    private String password;

    //https://stackoverflow.com/questions/67825729/using-enums-in-a-spring-entity
    @Enumerated(EnumType.STRING)
    @Column(name = "us_role", nullable = false)
    private Role role;

}
