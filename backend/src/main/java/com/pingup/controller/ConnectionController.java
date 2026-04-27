package com.pingup.controller;

import com.pingup.dto.UserResponse;
import com.pingup.service.FollowService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/connections")
public class ConnectionController {
    private final FollowService followService;

    public ConnectionController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping("/{userId}")
    public UserResponse follow(@PathVariable Long userId) {
        return followService.follow(userId);
    }

    @DeleteMapping("/{userId}")
    public void unfollow(@PathVariable Long userId) {
        followService.unfollow(userId);
    }

    @GetMapping("/{userId}/followers")
    public List<UserResponse> followers(@PathVariable Long userId) {
        return followService.followers(userId);
    }

    @GetMapping("/{userId}/following")
    public List<UserResponse> following(@PathVariable Long userId) {
        return followService.following(userId);
    }
}
