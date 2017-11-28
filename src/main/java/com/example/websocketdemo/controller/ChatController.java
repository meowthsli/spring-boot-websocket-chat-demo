package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.ChatMessage;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

/**
 * Created by rajeevkumarsingh on 24/07/17.
 */
@Controller
public class ChatController {
    
    @Autowired
    Chats chats;
    
    @Autowired
    SimpMessagingTemplate sender;

    @MessageMapping("/client.say")
    @SendTo("/broker/ops")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    /**
     * New op is here 
     * @param chatMessage
     * @param headerAccessor
     * @return 
     */
    @MessageMapping("/operator.hello")
    @SendTo("/broker/ops")
    public ChatMessage operatorHello(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("opname", chatMessage.getSender());
        
        // Read all chats with unread messages
        List<Chat.Item[]> ar = chats.getUnreadChats().stream()
                .map(x -> x.getLastN(10))
                .collect(Collectors.toList());
        
        // Make message
        ChatMessage chm = new ChatMessage();
        chm.setChatItems(ar.toArray(new Chat.Item[0][]));
        chm.setSender("SERVER");
        chm.setType(ChatMessage.MessageType.OP_UNREAD_LIST);
        
        // Brokers
        sender.convertAndSend("/broker/ops", chm);
        
        // Enrich with username
        chatMessage.setType(ChatMessage.MessageType.OP_STARTED);
        return chatMessage;
    }
}
