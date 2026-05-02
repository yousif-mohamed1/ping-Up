package com.pingup.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public class UserResponse {
    @JsonProperty("_id")
    public String id;
    public String email;
    @JsonProperty("full_name")
    public String fullName;
    public String username;
    public String bio;
    @JsonProperty("profile_picture")
    public String profilePicture;
    @JsonProperty("cover_photo")
    public String coverPhoto;
    public String location;
    public String website;
    @JsonProperty("is_verified")
    public boolean verified;
    @JsonProperty("isPrivate")
    public boolean privateAccount;
    public String role;
    public long followersCount;
    public long followingCount;
    public Instant createdAt;
    public Instant updatedAt;
}
