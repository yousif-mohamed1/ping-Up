package com.pingup.service;

import com.pingup.dto.UserResponse;
import com.pingup.entity.Follow;
import com.pingup.entity.User;
import com.pingup.exception.ApiException;
import com.pingup.repository.FollowRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    private static final String ACCEPTED = "ACCEPTED";
    private static final String PENDING = "PENDING";

    private final FollowRepository followRepository;
    private final UserService userService;

    public FollowService(FollowRepository followRepository, UserService userService) {
        this.followRepository = followRepository;
        this.userService = userService;
    }

    @Transactional
    public UserResponse follow(Long userId) {
        User current = userService.currentUser();
        User target = userService.getUser(userId);
        if (current.getId().equals(target.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot follow yourself");
        }
        Follow follow = followRepository.findByFollowerAndFollowing(current, target).orElse(null);
        if (follow == null) {
            follow = new Follow();
            follow.setFollower(current);
            follow.setFollowing(target);
        }
        follow.setStatus(target.isPrivateAccount() ? PENDING : ACCEPTED);
        followRepository.save(follow);
        return userService.toResponse(target);
    }

    @Transactional
    public void unfollow(Long userId) {
        User current = userService.currentUser();
        User target = userService.getUser(userId);
        followRepository.findByFollowerAndFollowing(current, target).ifPresent(followRepository::delete);
    }

    public List<UserResponse> followers(Long userId) {
        User user = userService.getUser(userId);
        return followRepository.findByFollowingAndStatus(user, ACCEPTED).stream()
                .map(f -> userService.toResponse(f.getFollower()))
                .collect(Collectors.toList());
    }

    public List<UserResponse> following(Long userId) {
        User user = userService.getUser(userId);
        return followRepository.findByFollowerAndStatus(user, ACCEPTED).stream()
                .map(f -> userService.toResponse(f.getFollowing()))
                .collect(Collectors.toList());
    }
}
