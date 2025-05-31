package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.LoginDTO;
import com.lsvp.InventoryManagement.dto.TokenDTO;
import com.lsvp.InventoryManagement.repository.IUserRepository;
import com.lsvp.InventoryManagement.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private IUserRepository userRepository;

    public TokenDTO login(LoginDTO dto) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getName(), dto.getPassword())
        );
        UserDetails user = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(user.getUsername());

        return new TokenDTO(token);
    }

    public void logout(String token) {
        
    // Não há como invalidar um token pois não está sendo armazenado no banco. 
    //então o correto seria recebermos a requisição aqui e no frontend apaga o token do local storage

    }

    public TokenDTO refreshToken(String token) {
        String username = jwtTokenUtil.extractUsername(token.replace("Bearer ", ""));
        String newToken = jwtTokenUtil.generateToken(username);
        return new TokenDTO(newToken);
    }
}