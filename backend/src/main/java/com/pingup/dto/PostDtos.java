package com.pingup.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class PostDtos {
    public static class CreatePostRequest {
        @Size(max = 3000)
        public String content;
        public List<String> imageUrls = new ArrayList<String>();
        public String videoUrl;
    }

    public static class PostResponse {
        @JsonProperty("_id")
        public String id;
        public UserResponse user;
        public String content;
        @JsonProperty("image_urls")
        public List<String> imageUrls = new ArrayList<String>();
        @JsonProperty("video_url")
        public String videoUrl;
        @JsonProperty("post_type")
        public String postType;
        @JsonProperty("likes_count")
        public List<String> likesCount = new ArrayList<String>();
        public long likesTotal;
        public boolean likedByMe;
        public Instant createdAt;
        public Instant updatedAt;
    }
}
