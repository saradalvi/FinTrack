package com.fintrack.backend.controller;

import com.fintrack.backend.dto.LoginRequestDTO;
import com.fintrack.backend.dto.LoginResponseDTO;
import com.fintrack.backend.dto.UserResponseDTO;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.security.JwtService;
import com.fintrack.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(
            @RequestBody User user) {

        User createdUser = userService.createUser(user);

        return ResponseEntity.ok(
                convertToDTO(createdUser)
        );
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        List<UserResponseDTO> users = userService
                .getAllUsers()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDTO> getUserByEmail(
            @PathVariable String email) {

        return userService
                .getUserByEmail(email)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO loginRequest) {

        return userService
                .loginUser(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
                .map(user -> {

                    String token = jwtService.generateToken(
                            user.getId(),
                            user.getEmail()
                    );

                    return ResponseEntity.ok(
                            new LoginResponseDTO(
                                    user.getId(),
                                    user.getName(),
                                    user.getEmail(),
                                    token
                            )
                    );
                })
                .orElseGet(() ->
                        ResponseEntity.status(401).build()
                );
    }

    private UserResponseDTO convertToDTO(User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}