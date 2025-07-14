package com.aneury.auth_service.controller;

import com.aneury.auth_service.dto.AuthRequest;
import com.aneury.auth_service.dto.RegisterRequest;
import com.aneury.auth_service.dto.TokenResponse;
import com.aneury.auth_service.dto.UserDto;
import com.aneury.auth_service.entity.User;
import com.aneury.auth_service.service.AuthService;
import com.aneury.auth_service.service.JwtService;
import com.aneury.auth_service.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            TokenResponse tokenResponse = authService.register(registerRequest);
            return ResponseEntity.ok(tokenResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            TokenResponse tokenResponse = authService.login(authRequest);
            return ResponseEntity.ok(tokenResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Bearer header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid authorization header");
            }

            String token = authHeader.substring(7);

            // Validate token
            boolean isValid = jwtService.validateToken(token);

            if (isValid) {
                String username = jwtService.extractUsername(token);
                Optional<User> user = userService.findByEmail(username);

                if (user.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Invalid token");
                }

                UserDto userDto = UserDto.builder()
                        .id(user.get().getId())
                        .name(user.get().getName())
                        .email(user.get().getEmail())
                        .role(user.get().getRole())
                        .build();

                return ResponseEntity.ok().body(userDto);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid or expired token");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error validating token: " + e.getMessage());
        }
    }
}
