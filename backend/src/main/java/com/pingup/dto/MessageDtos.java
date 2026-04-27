package com.pingup.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;

public class MessageDtos {
    public static class SendMessageRequest {
        @NotNull
        public Long receiverId;
        @Size(max = 3000)
        public String text;
        public String mediaUrl;
        public String messageType;
    }

    public static class MessageResponse {
        @JsonProperty("_id")
        public String id;
        @JsonProperty("from_user_id")
        public String fromUserId;
        @JsonProperty("to_user_id")
        public String toUserId;
        public UserResponse sender;
        public UserResponse receiver;
        public String text;
        @JsonProperty("message_type")
        public String messageType;
        @JsonProperty("media_url")
        public String mediaUrl;
        public boolean seen;
        public Instant createdAt;
    }
}
