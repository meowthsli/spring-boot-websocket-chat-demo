package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.Parcel;
import com.example.websocketdemo.model.Parcel2;
import java.time.Instant;
import java.util.Arrays;
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
        Chat uc = chats.getChat(getCurrentUserID(smha));
        
        Chat.Item item = uc
            .appendText(chatMessage.getText(), null);
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", Parcel.ack(chatMessage.getCid(), item.id, item.at));

        // relay cli msg to all ops, if not locked. if so, send to only owner
        Parcel answer = Parcel.makeChatMessage(getCurrentUserID(smha), item, chatMessage.getCid(), uc.getUnreadCount());
        if(uc.isLocked()) {
            answer.setOpID(uc.getLocker());
            this.convertAndSendToSession(uc.getLockerSession(), "/queue/op", answer);
            return null;
        }
        return answer;
    }
    
    @MessageMapping("/operator.say")
    @SendTo("/broadcast/all-ops")
    public Parcel operatorSay(@Payload Parcel opMessage, SimpMessageHeaderAccessor smha) {
        
        Chat uc = chats.getChat(opMessage.getClientID());
        if(uc.isLocked() && !uc.isLocked(getCurrentUserID(smha))) {
            return null; // no ack, no broadcast - can't talk to other locked chat
        }
 
        // append to chat
        Chat.Item item = chats.getChat(opMessage.getClientID())
            .appendText(opMessage.getText(), getCurrentUserID(smha));
        
        // ack
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/op", Parcel.ack(opMessage.getCid(), item.id, item.at, uc.getClientID()));
        
        // send to chat client
        Parcel msg = Parcel.makeChatMessage(opMessage.getClientID(), item, opMessage.getCid(), uc.getUnreadCount());
        this.convertAndSendToSession(chats.getChat(opMessage.getClientID()).getClientLastSession(), "/queue/client", msg);
        
        // relay to all ops
        if(uc.isLocked()) {
            return null;
        }
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
        opHello.setOpID(this.generateID(opHello.getClientDesc().email));
        
        setCurrentUserID(smha, opHello.getOpID());
        
        
        for(Chat uc: chats.getUnreadChats()) {
            Parcel p = Parcel.makeUnreadList(uc.getClientID(), uc.getLastN(1), uc.getUnreadCount());
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
    public Parcel2 clientHello(@Payload Parcel2 p,
                               SimpMessageHeaderAccessor smha) {
        // generate user id
        setCurrentUserID(smha, this.generateID(p.helloClientReq.userDesc.email));

        throw new RuntimeException("Not implemented");
        /*
        Chat uc = chats.getChat(getCurrentUserID(smha), p.helloClientReq.userDesc);
        uc.setLastSession(getCurrentSessionID(smha));
        uc.setClientDesc(clientHello.getClientDesc());

        // create history
        Parcel p3 = Parcel.makeClientHistory(getCurrentUserID(smha), uc.getLastN(20));
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", p);     

        // say others new client connected (?)
        Parcel2 pp = new Parcel2();
        pp.helloCliOk = new Parcel2.HelloCliOk();
        pp.helloCliOk.clientID = uc.getClientID();
        return pp;
        */
    }
    
    @MessageMapping("/operator.tryLock")
    @SendTo("/broadcast/all-ops")
    public Parcel tryLockChat(@Payload Parcel msgLock,
                               SimpMessageHeaderAccessor smha) {
        
        Chat uc = chats.getChat(msgLock.getClientID());        
        //if(uc.lock(getCurrentUserID(smha))) {
        uc.lock(getCurrentUserID(smha), getCurrentSessionID(smha));
            Parcel p = Parcel.makeLockOk(uc.getClientDesc(), msgLock.getClientID(), getCurrentUserID(smha));
            return p;
        //}
        //return null;
    }
    
    @MessageMapping("/operator.release")
    // @SendTo("/broadcast/all-ops")
    public Parcel releaseChat(@Payload Parcel msgLock,
                               SimpMessageHeaderAccessor smha) {
        
        Chat uc = chats.getChat(msgLock.getClientID());
        uc.unlock();
        
        //Chat.Item[] item = uc.getUnreadItems();
        //if(item.length > 0) {
            
        //}
        return null;
        
        //if(uc.lock(getCurrentUserID(smha))) {
        //uc.lock(getCurrentUserID(smha), getCurrentSessionID(smha));
        //    Parcel p = Parcel.makeLockOk(msgLock.getClientID(), getCurrentUserID(smha));
        //    return p;
        //}
        //return null;
        
    }
    
    @MessageMapping("/operator.getInfo")
    @SendToUser("/queue/op")
    public Parcel getInfo(@Payload Parcel msgGetInfo, SimpMessageHeaderAccessor smha) {
        Chat.ClientDesc[] descs = new Chat.ClientDesc[msgGetInfo.getInfo().length];
        for(int i = 0; i < descs.length; ++i) {
            descs[i] = new Chat.ClientDesc();
        }
        msgGetInfo.setInfoDesc(descs);
                
        for(int i = 0; i < msgGetInfo.getInfo().length; ++i) {
            Chat ch = chats.getChat(msgGetInfo.getInfo()[i]);
            msgGetInfo.getInfoDesc()[i] = ch.getClientDesc();
        }
        msgGetInfo.setType(Parcel.MessageType.INFO);
        return msgGetInfo;
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
    
    private String generateID(String email) {
        return java.util.Base64.getEncoder().encodeToString(
                email.getBytes()
        );
    }
}
