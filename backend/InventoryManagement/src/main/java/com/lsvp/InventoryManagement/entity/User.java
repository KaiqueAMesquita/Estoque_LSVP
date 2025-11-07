package com.lsvp.InventoryManagement.entity;

import com.lsvp.InventoryManagement.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
// Lucas:
// No código antigo, se importava o jakarta.validation.constraints.NotBlank
// Retirei por não precisarmos agora

@Entity
@Table(name = "tbl_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "us_id")
    private Long id;

    //Gustavo: Adicionado parametro unique no nome.
    @Column(name = "us_name", length = 50, nullable = false, unique = true)
    private String name;

    @Column(name = "us_password", length = 100, nullable = false)
    private String password;

    //https://stackoverflow.com/questions/67825729/using-enums-in-a-spring-entity
    @Enumerated(EnumType.STRING)
    @Column(name = "us_role", nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Movement> movements;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return "";
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
