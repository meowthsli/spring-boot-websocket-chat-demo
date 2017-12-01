package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.Parcel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    public Parcel clientSay(@Payload Parcel chatMessage, SimpMessageHeaderAccessor smha) {
    
        long id = chats.getChat(getCurrentUserID(smha))
            .appendText(chatMessage.getText(), null);
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", Parcel.ack(chatMessage.getCid(), id));

        // relay cli msg to all ops
        chatMessage.setAuthor(getCurrentUserID(smha));
        chatMessage.setAck(id);
        return chatMessage;
    }
    
    @MessageMapping("/operator.say")
    @SendTo("/broadcast/all-ops")
    public Parcel operatorSay(@Payload Parcel opMessage, SimpMessageHeaderAccessor smha) {
        
        // append to chat
        long id = chats.getChat(opMessage.getTo())
            .appendText(opMessage.getText(), getCurrentSessionID(smha));
        
        // ack
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/op", Parcel.ack(opMessage.getCid(), id));
        
        // send to chat client
        opMessage.setAuthor(getCurrentUserID(smha));
        opMessage.setAck(id);
        this.convertAndSendToSession(chats.getChat(opMessage.getTo()).getClientLastSession(), "/queue/client", opMessage);
        
        // relay to all ops
        return opMessage;
    }

    /**
     * New op is here 
     * @param opHello
     * @param smha
     * @return 
     */
    @MessageMapping("/operator.hello")
    @SendTo("/broadcast/all-ops")
    public Parcel operatorHello(@Payload Parcel opHello,
                               SimpMessageHeaderAccessor smha) {
        setCurrentUserID(smha, opHello.getAuthor());
        
        
        for(Chat uc: chats.getUnreadChats()) {
            Parcel p = Parcel.makeUnreadList(uc.getLastN(1));
            this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/op", p);     
        }
        
        return Parcel.helloOp(getCurrentUserID(smha));
    }
    
    /**
     * New op is here 
     * @param clientHello
     * @param smha
     * @return 
     */
    @MessageMapping("/client.hello")
    @SendTo("/broadcast/all-ops")
    public Parcel clientHello(@Payload Parcel clientHello,
                               SimpMessageHeaderAccessor smha) {
        setCurrentUserID(smha, clientHello.getAuthor());
        
        Chat uc = chats.getChat(getCurrentUserID(smha));
        uc.setLastSession(getCurrentSessionID(smha));
        
        Parcel p = Parcel.makeClientMessages(getCurrentUserID(smha), uc.getLastN(20));
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", p);     
        
        return Parcel.helloCli(uc.getClientID());
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
    
    private String getCurrentUserID(SimpMessageHeaderAccessor smha) {
        return (String)smha.getSessionAttributes().get("userID");
    }
    
    private void setCurrentUserID(SimpMessageHeaderAccessor smha, String id) {
        smha.getSessionAttributes().put("userID", id);
    }
    
    private String getCurrentSessionID(SimpMessageHeaderAccessor smha) {
        return (String)smha.getSessionId();
    }
}
