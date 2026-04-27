package com.pingup.controller;

import com.pingup.dto.StoryDtos;
import com.pingup.service.StoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/stories")
public class StoryController {
    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping
    public List<StoryDtos.StoryResponse> activeStories() {
        return storyService.activeStories();
    }

    @PostMapping
    public StoryDtos.StoryResponse create(@Valid @RequestBody StoryDtos.CreateStoryRequest request) {
        return storyService.create(request);
    }
}
