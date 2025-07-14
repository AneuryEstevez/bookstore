package com.aneury.auth_service.service;

import com.aneury.auth_service.dto.AuthRequest;
import com.aneury.auth_service.dto.RegisterRequest;
import com.aneury.auth_service.dto.TokenResponse;
import com.aneury.auth_service.entity.Role;
import com.aneury.auth_service.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public TokenResponse register(RegisterRequest registerRequest) {
        // Check if user with email already exists
        if (userService.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        
        User user = User
                .builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.ROLE_USER)
                .build();
        user = userService.save(user);
        String token = jwtService.generateToken(user);
        return new TokenResponse(token);
    }

    public TokenResponse login(AuthRequest authRequest) {
        User user = userService.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        String token = jwtService.generateToken(user);
        return new TokenResponse(token);
    }
}
