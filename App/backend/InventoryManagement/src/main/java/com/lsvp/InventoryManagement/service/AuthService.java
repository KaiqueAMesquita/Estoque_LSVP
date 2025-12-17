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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.exceptions.InvalidCredentialsException;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public TokenDTO login(LoginDTO dto) {

        try{
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getName(), dto.getPassword())
        );

        User user = userRepository.findByName(dto.getName()) .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!!"));
        String role = user.getRole().name();
        UserDetails userD = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(userD.getUsername(), role);

        return new TokenDTO(token);
        }
        // Exception para personalizar mensagem de erro.
        catch(BadCredentialsException e){
            throw new InvalidCredentialsException("Usuário ou senha inválidos!!");
        }
    }

    public void logout(String token) {
        
    // Não há como invalidar um token pois não está sendo armazenado no banco. 
    //então o correto seria recebermos a requisição aqui e no frontend apaga o token do local storage

    }

    public TokenDTO refreshToken(String token) {
        String username = jwtTokenUtil.extractUsername(token.replace("Bearer ", ""));
        String role = jwtTokenUtil.extractRole(token.replace("Bearer ", ""));
        
        String newToken = jwtTokenUtil.generateToken(username, role);
        return new TokenDTO(newToken);
    }
}