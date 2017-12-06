package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.Parcel;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Parcel clientSay(@Payload Parcel chatMessage, SimpMessageHeaderAccessor smha) {
    
        Chat.Item item = chats.getChat(getCurrentUserID(smha))
            .appendText(chatMessage.getText(), null);
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", Parcel.ack(chatMessage.getCid(), item.id, item.at));

        // relay cli msg to all ops
        return Parcel.makeChatMessage(getCurrentUserID(smha), item, chatMessage.getCid());
    }
    
    @MessageMapping("/operator.say")
    @SendTo("/broadcast/all-ops")
    public Parcel operatorSay(@Payload Parcel opMessage, SimpMessageHeaderAccessor smha) {
        
        // append to chat
        Chat.Item item = chats.getChat(opMessage.getClientID())
            .appendText(opMessage.getText(), getCurrentUserID(smha));
        
        // ack
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/op", Parcel.ack(opMessage.getCid(), item.id, item.at));
        
        // send to chat client
        Parcel msg = Parcel.makeChatMessage(opMessage.getClientID(), item, opMessage.getCid());
        this.convertAndSendToSession(chats.getChat(opMessage.getClientID()).getClientLastSession(), "/queue/client", msg);
        
        // relay to all ops
        return msg;
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
        setCurrentUserID(smha, opHello.getOpID());
        
        
        for(Chat uc: chats.getUnreadChats()) {
            Parcel p = Parcel.makeUnreadList(uc.getClientID(), uc.getLastN(1));
            this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/op", p);     
        }
        
        return Parcel.helloOp(getCurrentUserID(smha));
    }
    
    @MessageMapping("/operator.histo")
    @SendToUser("/queue/op")
    public Parcel operatorHisto(@Payload Parcel opHisto,
                               SimpMessageHeaderAccessor smha) {

        Chat uc = chats.getChat(opHisto.getClientID());
        Parcel p = Parcel.makeHisto(uc.getClientID(), uc.history.toArray(new Chat.Item[0]));
        
        return p;
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
        setCurrentUserID(smha, clientHello.getClientID());
        
        Chat uc = chats.getChat(getCurrentUserID(smha));
        uc.setLastSession(getCurrentSessionID(smha));
        
        Parcel p = Parcel.makeClientHistory(getCurrentUserID(smha), uc.getLastN(20));
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
