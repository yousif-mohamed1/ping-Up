package com.pingup.dto;

import com.pingup.entity.Message;
import com.pingup.entity.Post;
import com.pingup.entity.Story;
import com.pingup.entity.User;

import java.util.Collections;

public final class Mapper {
    private Mapper() {}

    public static UserResponse toUser(User user, long followers, long following) {
        UserResponse dto = new UserResponse();
        dto.id = String.valueOf(user.getId());
        dto.email = user.getEmail();
        dto.fullName = user.getFullName();
        dto.username = user.getUsername();
        dto.bio = user.getBio();
        dto.profilePicture = user.getProfilePicture();
        dto.coverPhoto = user.getCoverPhoto();
        dto.location = user.getLocation();
        dto.website = user.getWebsite();
        dto.verified = user.isVerified();
        dto.privateAccount = user.isPrivateAccount();
        dto.role = user.getRole();
        dto.followersCount = followers;
        dto.followingCount = following;
        dto.createdAt = user.getCreatedAt();
        dto.updatedAt = user.getUpdatedAt();
        return dto;
    }

    public static PostDtos.PostResponse toPost(Post post, long likesTotal, boolean likedByMe) {
        PostDtos.PostResponse dto = new PostDtos.PostResponse();
        dto.id = String.valueOf(post.getId());
        dto.user = toUser(post.getUser(), 0, 0);
        dto.content = post.getContent();
        dto.imageUrls = post.getImageUrls() == null ? Collections.<String>emptyList() : post.getImageUrls();
        dto.videoUrl = post.getVideoUrl();
        dto.postType = post.getPostType();
        dto.likesTotal = likesTotal;
        dto.likedByMe = likedByMe;
        dto.createdAt = post.getCreatedAt();
        dto.updatedAt = post.getUpdatedAt();
        return dto;
    }

    public static StoryDtos.StoryResponse toStory(Story story) {
        StoryDtos.StoryResponse dto = new StoryDtos.StoryResponse();
        dto.id = String.valueOf(story.getId());
        dto.user = toUser(story.getUser(), 0, 0);
        dto.content = story.getContent();
        dto.mediaUrl = story.getMediaUrl();
        dto.mediaType = story.getMediaType();
        dto.backgroundColor = story.getBackgroundColor();
        dto.createdAt = story.getCreatedAt();
        dto.expiresAt = story.getExpiresAt();
        return dto;
    }

    public static MessageDtos.MessageResponse toMessage(Message message) {
        MessageDtos.MessageResponse dto = new MessageDtos.MessageResponse();
        dto.id = String.valueOf(message.getId());
        dto.fromUserId = String.valueOf(message.getSender().getId());
        dto.toUserId = String.valueOf(message.getReceiver().getId());
        dto.sender = toUser(message.getSender(), 0, 0);
        dto.receiver = toUser(message.getReceiver(), 0, 0);
        dto.text = message.getText();
        dto.mediaUrl = message.getMediaUrl();
        dto.messageType = message.getMessageType();
        dto.seen = message.isSeen();
        dto.createdAt = message.getCreatedAt();
        return dto;
    }
}
