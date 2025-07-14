package com.aneury.auth_service.controller;

import com.aneury.auth_service.dto.UserDto;
import com.aneury.auth_service.entity.User;
import com.aneury.auth_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestHeader("X-User-Role") String userRole,
                                        @RequestBody User user) {
        if (userRole.equals("ROLE_ADMIN")) {
            try {
                // Check if user with email already exists
                if (userService.findByEmail(user.getEmail()).isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("User creation failed: User with this email already exists");
                }
                
                User newUser = userService.save(user);
                return new ResponseEntity<>(UserDto.fromEntity(newUser), HttpStatus.CREATED);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Internal server error");
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }
    }

    @GetMapping
    public ResponseEntity<?> getUsers(@RequestHeader("X-User-Role") String userRole,
                                      @PageableDefault(size = 12, page = 0) Pageable pageable) {
        if (userRole.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(userService.getAllUsers(pageable));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@RequestHeader("X-User-Role") String userRole,
                                        @PathVariable Long id,
                                        @RequestBody UserDto userDto) {
        if (userRole.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(userService.updateUser(id, userDto));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@RequestHeader("X-User-Role") String userRole,
                                        @PathVariable Long id) {
        if (userRole.equals("ROLE_ADMIN")) {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader("X-User-Role") String userRole) {
        if (!userRole.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        long totalUsers = userService.count();

        Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers
        );

        return ResponseEntity.ok(stats);
    }

}
