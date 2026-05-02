package com.pingup.controller;

import com.pingup.dto.AdminDtos;
import com.pingup.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportController {
    private final AdminService adminService;

    public ReportController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    public ResponseEntity<Void> createReport(@RequestBody AdminDtos.ReportRequest request) {
        adminService.createReport(request.postId, request.reason);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
