package com.pingup.service;

import com.pingup.dto.AuthDtos;
import com.pingup.dto.Mapper;
import com.pingup.entity.User;
import com.pingup.exception.ApiException;
import com.pingup.repository.UserRepository;
import com.pingup.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (userRepository.existsByUsername(request.username)) {
            throw new ApiException(HttpStatus.CONFLICT, "Username is already taken");
        }
        User user = new User();
        user.setEmail(request.email.toLowerCase());
        user.setUsername(request.username);
        user.setFullName(request.fullName);
        user.setPasswordHash(passwordEncoder.encode(request.password));
        user.setBio("");
        user.setProfilePicture("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200");
        user.setCoverPhoto("");
        user.setVerified(false);
        User saved = userRepository.save(user);
        return new AuthDtos.AuthResponse(jwtService.generateToken(saved.getEmail()), Mapper.toUser(saved, 0, 0));
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email, request.password));
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return new AuthDtos.AuthResponse(jwtService.generateToken(user.getEmail()), Mapper.toUser(user, 0, 0));
    }
}
