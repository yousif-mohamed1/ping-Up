package com.pingup.service;

import com.pingup.dto.Mapper;
import com.pingup.dto.MessageDtos;
import com.pingup.entity.Message;
import com.pingup.entity.User;
import com.pingup.exception.ApiException;
import com.pingup.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository, UserService userService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
    }

    public List<MessageDtos.MessageResponse> conversation(Long userId) {
        User current = userService.currentUser();
        User other = userService.getUser(userId);
        return messageRepository.findConversation(current, other).stream()
                .map(Mapper::toMessage)
                .collect(Collectors.toList());
    }

    public List<MessageDtos.MessageResponse> recent() {
        User current = userService.currentUser();
        Map<Long, Message> latestByContact = new LinkedHashMap<Long, Message>();
        for (Message message : messageRepository.findRecentForUser(current)) {
            User contact = message.getSender().getId().equals(current.getId()) ? message.getReceiver() : message.getSender();
            if (!latestByContact.containsKey(contact.getId())) {
                latestByContact.put(contact.getId(), message);
            }
        }
        return latestByContact.values().stream().map(Mapper::toMessage).collect(Collectors.toList());
    }

    @Transactional
    public MessageDtos.MessageResponse send(MessageDtos.SendMessageRequest request) {
        if (!StringUtils.hasText(request.text) && !StringUtils.hasText(request.mediaUrl)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Message text or media is required");
        }
        Message message = new Message();
        message.setSender(userService.currentUser());
        message.setReceiver(userService.getUser(request.receiverId));
        message.setText(request.text == null ? "" : request.text.trim());
        message.setMediaUrl(request.mediaUrl);
        message.setMessageType(StringUtils.hasText(request.messageType) ? request.messageType : "text");
        message.setSeen(false);
        return Mapper.toMessage(messageRepository.save(message));
    }
}
