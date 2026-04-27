package com.pingup.service;

import com.pingup.dto.Mapper;
import com.pingup.dto.PostDtos;
import com.pingup.entity.Post;
import com.pingup.entity.PostLike;
import com.pingup.entity.User;
import com.pingup.exception.ApiException;
import com.pingup.repository.PostLikeRepository;
import com.pingup.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository, PostLikeRepository likeRepository, UserService userService) {
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.userService = userService;
    }

    public List<PostDtos.PostResponse> feed() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PostDtos.PostResponse> byUser(Long userId) {
        User user = userService.getUser(userId);
        return postRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDtos.PostResponse create(PostDtos.CreatePostRequest request) {
        if (!StringUtils.hasText(request.content) && (request.imageUrls == null || request.imageUrls.isEmpty()) && !StringUtils.hasText(request.videoUrl)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please add text, image, or video");
        }
        Post post = new Post();
        post.setUser(userService.currentUser());
        apply(post, request);
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public PostDtos.PostResponse update(Long id, PostDtos.CreatePostRequest request) {
        Post post = findOwnedPost(id);
        apply(post, request);
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public void delete(Long id) {
        Post post = findOwnedPost(id);
        postRepository.delete(post);
    }

    @Transactional
    public PostDtos.PostResponse toggleLike(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Post not found"));
        User user = userService.currentUser();
        Optional<PostLike> existingLike = likeRepository.findByPostAndUser(post, user);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
        }
        return toResponse(post);
    }

    private Post findOwnedPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getUser().getId().equals(userService.currentUser().getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only change your own posts");
        }
        return post;
    }

    private void apply(Post post, PostDtos.CreatePostRequest request) {
        post.setContent(request.content == null ? "" : request.content.trim());
        post.setImageUrls(request.imageUrls == null ? new ArrayList<String>() : request.imageUrls);
        post.setVideoUrl(request.videoUrl);
        if (StringUtils.hasText(request.videoUrl)) {
            post.setPostType("video");
        } else if (request.imageUrls != null && !request.imageUrls.isEmpty()) {
            post.setPostType(StringUtils.hasText(request.content) ? "text_with_image" : "image");
        } else {
            post.setPostType("text");
        }
    }

    private PostDtos.PostResponse toResponse(Post post) {
        long likes = likeRepository.countByPost(post);
        boolean liked = false;
        try {
            liked = likeRepository.existsByPostAndUser(post, userService.currentUser());
        } catch (Exception ignored) {
            liked = false;
        }
        return Mapper.toPost(post, likes, liked);
    }
}
