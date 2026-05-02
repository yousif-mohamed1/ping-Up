package com.pingup.controller;

import com.pingup.dto.AdminDtos;
import com.pingup.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ── Dashboard Stats ────────────────────────────────────

    @GetMapping("/stats")
    public AdminDtos.StatsResponse getStats() {
        return adminService.getStats();
    }

    // ── Analytics ──────────────────────────────────────────

    @GetMapping("/analytics/users")
    public List<AdminDtos.TimeSeriesPoint> userGrowth(@RequestParam(defaultValue = "7d") String range) {
        return adminService.getUserGrowthData(range);
    }

    @GetMapping("/analytics/posts")
    public List<AdminDtos.TimeSeriesPoint> postActivity(@RequestParam(defaultValue = "7d") String range) {
        return adminService.getPostActivityData(range);
    }

    @GetMapping("/analytics/engagement")
    public List<AdminDtos.TimeSeriesPoint> engagement(@RequestParam(defaultValue = "7d") String range) {
        return adminService.getEngagementData(range);
    }

    // ── Trending ───────────────────────────────────────────

    @GetMapping("/trending/hashtags")
    public List<AdminDtos.TrendingHashtagResponse> trendingHashtags(@RequestParam(defaultValue = "24h") String range) {
        return adminService.getTrendingHashtags(range);
    }

    @GetMapping("/trending/profiles")
    public List<AdminDtos.ViralProfileResponse> viralProfiles(@RequestParam(defaultValue = "7d") String range) {
        return adminService.getViralProfiles(range);
    }

    @GetMapping("/trending/posts")
    public List<AdminDtos.ViralPostResponse> viralPosts(@RequestParam(defaultValue = "7d") String range) {
        return adminService.getViralPosts(range);
    }

    // ── User Management ────────────────────────────────────

    @GetMapping("/users")
    public List<AdminDtos.AdminUserResponse> listUsers() {
        return adminService.getAllUsers();
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Void> updateRole(@PathVariable Long id, @RequestBody AdminDtos.UpdateRoleRequest request) {
        adminService.updateRole(id, request.role);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable Long id, @RequestBody AdminDtos.BanRequest request) {
        adminService.banUser(id, request.banned);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/mute")
    public ResponseEntity<Void> muteUser(@PathVariable Long id, @RequestBody AdminDtos.MuteRequest request) {
        adminService.muteUser(id, request.muted);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ── Reports ────────────────────────────────────────────

    @GetMapping("/reports")
    public List<AdminDtos.ReportResponse> getReports(@RequestParam(required = false) String status) {
        return adminService.getReports(status);
    }

    @PatchMapping("/reports/{id}")
    public ResponseEntity<Void> reviewReport(@PathVariable Long id, @RequestBody AdminDtos.ReviewReportRequest request) {
        adminService.reviewReport(id, request.action);
        return ResponseEntity.noContent().build();
    }

    // ── Post Moderation ────────────────────────────────────

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // ── Hashtag Management ─────────────────────────────────

    @PostMapping("/hashtags/pin")
    public ResponseEntity<Void> pinHashtag(@RequestBody AdminDtos.PinHashtagRequest request) {
        adminService.pinHashtag(request.name);
        return ResponseEntity.noContent().build();
    }

    // ── Banned Words ───────────────────────────────────────

    @GetMapping("/banned-words")
    public List<AdminDtos.BannedWordResponse> getBannedWords() {
        return adminService.getBannedWords();
    }

    @PostMapping("/banned-words")
    public AdminDtos.BannedWordResponse addBannedWord(@RequestBody AdminDtos.BannedWordRequest request) {
        return adminService.addBannedWord(request.word);
    }

    @DeleteMapping("/banned-words/{id}")
    public ResponseEntity<Void> removeBannedWord(@PathVariable Long id) {
        adminService.removeBannedWord(id);
        return ResponseEntity.noContent().build();
    }
}
