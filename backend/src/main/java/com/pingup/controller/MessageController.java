package com.pingup.controller;

import com.pingup.dto.MessageDtos;
import com.pingup.service.MessageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/recent")
    public List<MessageDtos.MessageResponse> recent() {
        return messageService.recent();
    }

    @GetMapping("/{userId}")
    public List<MessageDtos.MessageResponse> conversation(@PathVariable Long userId) {
        return messageService.conversation(userId);
    }

    @PostMapping
    public MessageDtos.MessageResponse send(@Valid @RequestBody MessageDtos.SendMessageRequest request) {
        return messageService.send(request);
    }
}
