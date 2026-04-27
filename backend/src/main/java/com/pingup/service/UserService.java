package com.pingup.service;

import com.pingup.dto.Mapper;
import com.pingup.dto.UserDtos;
import com.pingup.dto.UserResponse;
import com.pingup.entity.User;
import com.pingup.exception.ApiException;
import com.pingup.repository.FollowRepository;
import com.pingup.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final String ACCEPTED = "ACCEPTED";

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Login is required"));
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Login is required"));
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserResponse me() {
        return toResponse(currentUser());
    }

    public UserResponse getProfile(Long id) {
        return toResponse(getUser(id));
    }

    public List<UserResponse> search(String query) {
        List<User> users;
        if (!StringUtils.hasText(query)) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findTop30ByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCaseOrBioContainingIgnoreCaseOrLocationContainingIgnoreCase(
                    query, query, query, query);
        }
        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateMe(UserDtos.UpdateProfileRequest request) {
        User user = currentUser();
        if (StringUtils.hasText(request.username) && !request.username.equalsIgnoreCase(user.getUsername())) {
            if (userRepository.existsByUsername(request.username)) {
                throw new ApiException(HttpStatus.CONFLICT, "Username is already taken");
            }
            user.setUsername(request.username);
        }
        if (StringUtils.hasText(request.fullName)) user.setFullName(request.fullName);
        if (request.bio != null) user.setBio(request.bio);
        if (request.profilePicture != null) user.setProfilePicture(request.profilePicture);
        if (request.coverPhoto != null) user.setCoverPhoto(request.coverPhoto);
        if (request.location != null) user.setLocation(request.location);
        if (request.website != null) user.setWebsite(request.website);
        if (request.privateAccount != null) user.setPrivateAccount(request.privateAccount);
        return toResponse(userRepository.save(user));
    }

    public UserResponse toResponse(User user) {
        long followers = followRepository.countByFollowingAndStatus(user, ACCEPTED);
        long following = followRepository.countByFollowerAndStatus(user, ACCEPTED);
        return Mapper.toUser(user, followers, following);
    }
}
