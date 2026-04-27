package com.pingup.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.Size;
import java.time.Instant;

public class StoryDtos {
    public static class CreateStoryRequest {
        @Size(max = 1000)
        public String content;
        public String mediaUrl;
        public String mediaType;
        public String backgroundColor;
    }

    public static class StoryResponse {
        @JsonProperty("_id")
        public String id;
        public UserResponse user;
        public String content;
        @JsonProperty("media_url")
        public String mediaUrl;
        @JsonProperty("media_type")
        public String mediaType;
        @JsonProperty("background_color")
        public String backgroundColor;
        public Instant createdAt;
        public Instant expiresAt;
    }
}
