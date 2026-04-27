package com.pingup.controller;

import com.pingup.dto.PostDtos;
import com.pingup.service.PostService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/feed")
    public List<PostDtos.PostResponse> feed() {
        return postService.feed();
    }

    @GetMapping("/user/{userId}")
    public List<PostDtos.PostResponse> byUser(@PathVariable Long userId) {
        return postService.byUser(userId);
    }

    @PostMapping
    public PostDtos.PostResponse create(@Valid @RequestBody PostDtos.CreatePostRequest request) {
        return postService.create(request);
    }

    @PutMapping("/{id}")
    public PostDtos.PostResponse update(@PathVariable Long id, @Valid @RequestBody PostDtos.CreatePostRequest request) {
        return postService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        postService.delete(id);
    }

    @PostMapping("/{id}/like")
    public PostDtos.PostResponse toggleLike(@PathVariable Long id) {
        return postService.toggleLike(id);
    }
}
