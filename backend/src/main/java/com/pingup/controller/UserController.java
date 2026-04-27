package com.pingup.controller;

import com.pingup.dto.UserDtos;
import com.pingup.dto.UserResponse;
import com.pingup.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me() {
        return userService.me();
    }

    @PutMapping("/me")
    public UserResponse updateMe(@Valid @RequestBody UserDtos.UpdateProfileRequest request) {
        return userService.updateMe(request);
    }

    @GetMapping("/{id}")
    public UserResponse getProfile(@PathVariable Long id) {
        return userService.getProfile(id);
    }

    @GetMapping
    public List<UserResponse> search(@RequestParam(required = false) String q) {
        return userService.search(q);
    }
}
