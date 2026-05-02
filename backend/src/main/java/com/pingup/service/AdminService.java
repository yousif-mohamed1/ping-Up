package com.pingup.service;

import com.pingup.dto.AdminDtos;
import com.pingup.dto.Mapper;
import com.pingup.dto.PostDtos;
import com.pingup.dto.UserResponse;
import com.pingup.entity.BannedWord;
import com.pingup.entity.Hashtag;
import com.pingup.entity.Post;
import com.pingup.entity.Report;
import com.pingup.entity.User;
import com.pingup.exception.ApiException;
import com.pingup.repository.BannedWordRepository;
import com.pingup.repository.FollowRepository;
import com.pingup.repository.HashtagRepository;
import com.pingup.repository.PostLikeRepository;
import com.pingup.repository.PostRepository;
import com.pingup.repository.ReportRepository;
import com.pingup.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final FollowRepository followRepository;
    private final ReportRepository reportRepository;
    private final HashtagRepository hashtagRepository;
    private final BannedWordRepository bannedWordRepository;
    private final UserService userService;

    public AdminService(UserRepository userRepository,
                        PostRepository postRepository,
                        PostLikeRepository postLikeRepository,
                        FollowRepository followRepository,
                        ReportRepository reportRepository,
                        HashtagRepository hashtagRepository,
                        BannedWordRepository bannedWordRepository,
                        UserService userService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
        this.followRepository = followRepository;
        this.reportRepository = reportRepository;
        this.hashtagRepository = hashtagRepository;
        this.bannedWordRepository = bannedWordRepository;
        this.userService = userService;
    }

    // ── Stats ──────────────────────────────────────────────

    public AdminDtos.StatsResponse getStats() {
        AdminDtos.StatsResponse stats = new AdminDtos.StatsResponse();
        Instant now = Instant.now();
        Instant todayStart = LocalDate.now(ZoneOffset.UTC).atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant sevenDaysAgo = now.minusSeconds(7 * 24 * 3600);

        stats.totalUsers = userRepository.count();
        stats.totalPosts = postRepository.count();
        stats.postsToday = postRepository.countByCreatedAtAfter(todayStart);
        stats.activeReports = reportRepository.countByStatus("PENDING");
        stats.newSignups7d = userRepository.countByCreatedAtAfter(sevenDaysAgo);
        stats.bannedUsers = userRepository.countByBannedTrue();
        stats.mutedUsers = userRepository.countByMutedTrue();
        stats.likesToday = postLikeRepository.countByCreatedAtAfter(todayStart);
        return stats;
    }

    // ── Analytics ──────────────────────────────────────────

    public List<AdminDtos.TimeSeriesPoint> getUserGrowthData(String range) {
        int days = parseDays(range);
        return buildTimeSeries(days, d -> {
            Instant start = d.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = d.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            return userRepository.countByCreatedAtAfter(start) - userRepository.countByCreatedAtAfter(end);
        });
    }

    public List<AdminDtos.TimeSeriesPoint> getPostActivityData(String range) {
        int days = parseDays(range);
        return buildTimeSeries(days, d -> {
            Instant start = d.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = d.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            return postRepository.countByCreatedAtAfter(start) - postRepository.countByCreatedAtAfter(end);
        });
    }

    public List<AdminDtos.TimeSeriesPoint> getEngagementData(String range) {
        int days = parseDays(range);
        return buildTimeSeries(days, d -> {
            Instant start = d.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = d.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            return postLikeRepository.countByCreatedAtAfter(start) - postLikeRepository.countByCreatedAtAfter(end);
        });
    }

    // ── Trending ───────────────────────────────────────────

    public List<AdminDtos.TrendingHashtagResponse> getTrendingHashtags(String range) {
        int days = parseDays(range);
        Instant since = Instant.now().minusSeconds(days * 24L * 3600);
        List<Object[]> results = hashtagRepository.findTrending(since, PageRequest.of(0, 10));
        return results.stream().map(row -> {
            Hashtag h = (Hashtag) row[0];
            long count = (Long) row[1];
            return new AdminDtos.TrendingHashtagResponse(h.getName(), count, h.isPinned());
        }).collect(Collectors.toList());
    }

    public List<AdminDtos.ViralProfileResponse> getViralProfiles(String range) {
        int days = parseDays(range);
        Instant since = Instant.now().minusSeconds(days * 24L * 3600);
        List<Object[]> results = followRepository.findTopByFollowerGrowth(since, PageRequest.of(0, 10));
        return results.stream().map(row -> {
            User u = (User) row[0];
            long growth = (Long) row[1];
            return new AdminDtos.ViralProfileResponse(userService.toResponse(u), growth);
        }).collect(Collectors.toList());
    }

    public List<AdminDtos.ViralPostResponse> getViralPosts(String range) {
        int days = parseDays(range);
        Instant since = Instant.now().minusSeconds(days * 24L * 3600);
        List<Object[]> results = postRepository.findTopByLikes(since, PageRequest.of(0, 5));
        return results.stream().map(row -> {
            Post p = (Post) row[0];
            long likes = (Long) row[1];
            PostDtos.PostResponse dto = Mapper.toPost(p, likes, false);
            return new AdminDtos.ViralPostResponse(dto, likes);
        }).collect(Collectors.toList());
    }

    // ── Users ──────────────────────────────────────────────

    public List<AdminDtos.AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            AdminDtos.AdminUserResponse dto = new AdminDtos.AdminUserResponse();
            dto.user = userService.toResponse(u);
            dto.muted = u.isMuted();
            dto.banned = u.isBanned();
            dto.mutedAt = u.getMutedAt();
            dto.bannedAt = u.getBannedAt();
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateRole(Long userId, String role) {
        if (!"USER".equals(role) && !"MODERATOR".equals(role) && !"SUPER_ADMIN".equals(role)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid role: " + role);
        }
        User current = userService.currentUser();
        if (current.getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Cannot change your own role");
        }
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        target.setRole(role);
        userRepository.save(target);
    }

    @Transactional
    public void banUser(Long userId, boolean banned) {
        User current = userService.currentUser();
        if (current.getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Cannot ban yourself");
        }
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        target.setBanned(banned);
        target.setBannedAt(banned ? Instant.now() : null);
        userRepository.save(target);
    }

    @Transactional
    public void muteUser(Long userId, boolean muted) {
        User current = userService.currentUser();
        if (current.getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Cannot mute yourself");
        }
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        target.setMuted(muted);
        target.setMutedAt(muted ? Instant.now() : null);
        userRepository.save(target);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User current = userService.currentUser();
        if (current.getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Cannot delete yourself");
        }
        if (!userRepository.existsById(userId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(userId);
    }

    // ── Reports ────────────────────────────────────────────

    public List<AdminDtos.ReportResponse> getReports(String status) {
        List<Report> reports;
        if (status != null && !status.isEmpty()) {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc("PENDING");
        }
        return reports.stream().map(r -> {
            AdminDtos.ReportResponse dto = new AdminDtos.ReportResponse();
            dto.id = r.getId();
            dto.reporter = userService.toResponse(r.getReporter());
            dto.postId = r.getPost().getId();
            dto.postContentPreview = r.getPost().getContent() != null
                    ? r.getPost().getContent().substring(0, Math.min(r.getPost().getContent().length(), 100))
                    : "";
            dto.reason = r.getReason();
            dto.status = r.getStatus();
            dto.createdAt = r.getCreatedAt();
            dto.reviewedAt = r.getReviewedAt();
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void reviewReport(Long reportId, String action) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Report not found"));
        User reviewer = userService.currentUser();

        switch (action.toUpperCase()) {
            case "KEEP":
                report.setStatus("DISMISSED");
                break;
            case "DISMISS":
                report.setStatus("DISMISSED");
                break;
            case "DELETE":
                report.setStatus("REVIEWED");
                postRepository.deleteById(report.getPost().getId());
                break;
            default:
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid action: " + action);
        }
        report.setReviewedAt(Instant.now());
        report.setReviewedBy(reviewer);
        reportRepository.save(report);
    }

    @Transactional
    public void deletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Post not found");
        }
        postRepository.deleteById(postId);
    }

    // ── Reports (user-facing) ──────────────────────────────

    @Transactional
    public void createReport(Long postId, String reason) {
        User reporter = userService.currentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Post not found"));
        Report report = new Report();
        report.setReporter(reporter);
        report.setPost(post);
        report.setReason(reason);
        report.setStatus("PENDING");
        reportRepository.save(report);
    }

    // ── Banned Words ───────────────────────────────────────

    public List<AdminDtos.BannedWordResponse> getBannedWords() {
        return bannedWordRepository.findAll().stream()
                .map(bw -> new AdminDtos.BannedWordResponse(bw.getId(), bw.getWord(), bw.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminDtos.BannedWordResponse addBannedWord(String word) {
        String normalized = word.toLowerCase().trim();
        if (bannedWordRepository.existsByWord(normalized)) {
            throw new ApiException(HttpStatus.CONFLICT, "Word already banned");
        }
        BannedWord bw = new BannedWord();
        bw.setWord(normalized);
        bw.setCreatedBy(userService.currentUser());
        bw = bannedWordRepository.save(bw);
        return new AdminDtos.BannedWordResponse(bw.getId(), bw.getWord(), bw.getCreatedAt());
    }

    @Transactional
    public void removeBannedWord(Long id) {
        if (!bannedWordRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Banned word not found");
        }
        bannedWordRepository.deleteById(id);
    }

    // ── Hashtag Management ─────────────────────────────────

    @Transactional
    public void pinHashtag(String name) {
        String normalized = name.toLowerCase().trim();
        Hashtag hashtag = hashtagRepository.findByName(normalized)
                .orElseGet(() -> {
                    Hashtag h = new Hashtag();
                    h.setName(normalized);
                    return hashtagRepository.save(h);
                });
        hashtag.setPinned(true);
        hashtagRepository.save(hashtag);
    }

    // ── Helpers ────────────────────────────────────────────

    private int parseDays(String range) {
        if (range == null) return 7;
        switch (range) {
            case "24h": return 1;
            case "7d": return 7;
            case "30d": return 30;
            case "90d": return 90;
            default: return 7;
        }
    }

    @FunctionalInterface
    private interface DayCounter {
        long count(LocalDate date);
    }

    private List<AdminDtos.TimeSeriesPoint> buildTimeSeries(int days, DayCounter counter) {
        List<AdminDtos.TimeSeriesPoint> points = new ArrayList<>();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM/dd");
        for (int i = days - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            long count = Math.max(0, counter.count(d));
            points.add(new AdminDtos.TimeSeriesPoint(d.format(fmt), count));
        }
        return points;
    }
}
