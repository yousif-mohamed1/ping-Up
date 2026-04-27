package com.pingup.service;

import com.pingup.dto.Mapper;
import com.pingup.dto.StoryDtos;
import com.pingup.entity.Story;
import com.pingup.repository.StoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoryService {
    private final StoryRepository storyRepository;
    private final UserService userService;

    public StoryService(StoryRepository storyRepository, UserService userService) {
        this.storyRepository = storyRepository;
        this.userService = userService;
    }

    public List<StoryDtos.StoryResponse> activeStories() {
        return storyRepository.findByExpiresAtAfterOrderByCreatedAtDesc(Instant.now()).stream()
                .map(Mapper::toStory)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoryDtos.StoryResponse create(StoryDtos.CreateStoryRequest request) {
        Story story = new Story();
        story.setUser(userService.currentUser());
        story.setContent(request.content == null ? "" : request.content.trim());
        story.setMediaUrl(request.mediaUrl);
        story.setMediaType(StringUtils.hasText(request.mediaType) ? request.mediaType : "text");
        story.setBackgroundColor(StringUtils.hasText(request.backgroundColor) ? request.backgroundColor : "#4f46e5");
        return Mapper.toStory(storyRepository.save(story));
    }
}
