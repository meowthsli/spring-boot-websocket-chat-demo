package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.Parcel;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.core.MessagePostProcessor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

/**
 * Created by  on 24/07/17.
 */
@Controller
public class ChatController {
    
    @Autowired
    Chats chats;
    
    @Autowired
    SimpMessagingTemplate sender;

    @MessageMapping("/client.say")
    @SendTo("/broadcast/all-ops")
    public Parcel sendMessage(@Payload Parcel chatMessage) {
        return chatMessage;
    }

    /**
     * New op is here 
     * @param chatMessage
     * @param headerAccessor
     * @return 
     */
    @MessageMapping("/operator.hello")
    @SendTo("/broadcast/all-ops")
    public Parcel operatorHello(@Payload Parcel chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        // headerAccessor.getSessionAttributes().put("opname", chatMessage.getSender());
        
        String sessionID = headerAccessor.getSessionId();
        // Read all chats with unread messages
        
        for(Chat uc: chats.getUnreadChats()) {
            Parcel p = Parcel.makeUnreadList(uc.userID, uc.getLastN(1));
            this.convertAndSendToSession(sessionID, "/queue/op", p);     
        }
        
        // Enrich with username
        return Parcel.hello(chatMessage.getSender());
    }
    
    private void convertAndSendToSession(String sessionID, String destination, Object p) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        if(sender.getHeaderInitializer()!= null) {
            sender.getHeaderInitializer().initHeaders(headerAccessor);
        }
        headerAccessor.setSessionId(sessionID);
        headerAccessor.setLeaveMutable(true);
        
        sender.convertAndSendToUser(sessionID, destination, p, headerAccessor.getMessageHeaders());
    }
}
