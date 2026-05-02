package com.pingup.dto;

import java.time.Instant;
import java.util.List;

public class AdminDtos {

    public static class StatsResponse {
        public long totalUsers;
        public long postsToday;
        public long activeReports;
        public long newSignups7d;
        public long bannedUsers;
        public long mutedUsers;
        public long totalPosts;
        public long likesToday;
    }

    public static class TimeSeriesPoint {
        public String date;
        public long count;

        public TimeSeriesPoint() {}

        public TimeSeriesPoint(String date, long count) {
            this.date = date;
            this.count = count;
        }
    }

    public static class TrendingHashtagResponse {
        public String name;
        public long count;
        public boolean pinned;

        public TrendingHashtagResponse() {}

        public TrendingHashtagResponse(String name, long count, boolean pinned) {
            this.name = name;
            this.count = count;
            this.pinned = pinned;
        }
    }

    public static class ViralProfileResponse {
        public UserResponse user;
        public long followerGrowth;

        public ViralProfileResponse() {}

        public ViralProfileResponse(UserResponse user, long followerGrowth) {
            this.user = user;
            this.followerGrowth = followerGrowth;
        }
    }

    public static class ViralPostResponse {
        public PostDtos.PostResponse post;
        public long totalLikes;

        public ViralPostResponse() {}

        public ViralPostResponse(PostDtos.PostResponse post, long totalLikes) {
            this.post = post;
            this.totalLikes = totalLikes;
        }
    }

    public static class ReportResponse {
        public Long id;
        public UserResponse reporter;
        public String postContentPreview;
        public Long postId;
        public String reason;
        public String status;
        public Instant createdAt;
        public Instant reviewedAt;
    }

    public static class ReviewReportRequest {
        public String action; // "KEEP", "DISMISS", "DELETE"
    }

    public static class UpdateRoleRequest {
        public String role; // "USER", "MODERATOR", "SUPER_ADMIN"
    }

    public static class MuteRequest {
        public boolean muted;
    }

    public static class BanRequest {
        public boolean banned;
    }

    public static class BannedWordRequest {
        public String word;
    }

    public static class BannedWordResponse {
        public Long id;
        public String word;
        public Instant createdAt;

        public BannedWordResponse() {}

        public BannedWordResponse(Long id, String word, Instant createdAt) {
            this.id = id;
            this.word = word;
            this.createdAt = createdAt;
        }
    }

    public static class PinHashtagRequest {
        public String name;
    }

    public static class ReportRequest {
        public Long postId;
        public String reason;
    }

    public static class AdminUserResponse {
        public UserResponse user;
        public boolean muted;
        public boolean banned;
        public Instant mutedAt;
        public Instant bannedAt;
    }
}
