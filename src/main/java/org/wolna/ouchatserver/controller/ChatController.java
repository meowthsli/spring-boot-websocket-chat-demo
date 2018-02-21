package org.wolna.ouchatserver.controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.wolna.ouchat.Envelope;
import org.wolna.ouchat.Envelope.ClientHello;
import org.wolna.ouchat.Envelope.HelloOk;

/**
 * Created by  on 24/07/17.
 */
@Controller
public class ChatController {
    static Log LOG = LogFactory.getLog(ChatController.class);
    
    @Autowired
    private SimpMessagingTemplate sender;
    
    static volatile AtomicLong messageId = new AtomicLong(1);
    
    /**
     * New op is here 
     * @param hello
     * @param clientHello
     * @param smha
     * @return 
     */
    @MessageMapping("/client.hello")
    @SendTo("/broadcast/all-ops")
    public ClientHello clientHello(@Payload ClientHello hello,
                               SimpMessageHeaderAccessor smha) {
        // generate user id
        setCurrentUserID(smha, this.generateID(hello.desc.userLogin));

        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", new HelloOk()); // example of send to client back

        return hello;
    }
    
    @MessageMapping("/client.say")
    @SendTo("/broadcast/all-ops")
    public Envelope.MessageToServer clientSay(@Payload Envelope.MessageToServer chatMessage, 
            SimpMessageHeaderAccessor smha, Principal who) {
        String clientId = getCurrentUserID(smha);
        long id = messageId.incrementAndGet();
        
        // send back acceptance
        Envelope e = new Envelope();
        e.messageAccepted = new Envelope.MessageAccepted(chatMessage.temporaryId, id, Date.from(Instant.now()));
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", e);

        return new Envelope.MessageToServer(chatMessage.text, id);
    }
    
    @MessageMapping("/client.histo")
    public void clientHistory(@Payload Envelope.LoadHistory getHisto, SimpMessageHeaderAccessor smha) {
        Envelope e = new Envelope();
        e.loadHistoryResp = new Envelope.LoadHistoryResp(new String[]{"HELLO"}, "noone");
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/client", e);
    }
    
    /// operator handlers

    /**
     * New op is here 
     * @param hello
     * @param smha
     * @return 
     */
    @MessageMapping("/op.hello")
    @SendTo("/broadcast/all-ops")
    public void operatorHello(@Payload Envelope.OpHello hello,
                               SimpMessageHeaderAccessor smha) {
        setCurrentUserID(smha, this.generateID(hello.desc.userLogin));
        
        this.convertAndSendToSession(getCurrentSessionID(smha), "/queue/op", new HelloOk()); // example of send to client back
    }
    
    @MessageMapping("/operator.histo")
    @SendToUser("/queue/op")
    public Envelope operatorHisto(@Payload Envelope.LoadHistoryOp opHisto,
                               SimpMessageHeaderAccessor smha) {
        throw new UnsupportedOperationException("Not implemented");
    }
    
    @MessageMapping("/operator.say")
    public void operatorSay(@Payload Envelope.MessageToServerOp opMessage, SimpMessageHeaderAccessor smha) {  
        throw new UnsupportedOperationException("Not supported");
    }
    
    @MessageMapping("/operator.tryLock")
    @SendTo("/broadcast/all-ops")
    public Envelope tryLockChat(@Payload Envelope.TryLockChat msgLock,
                               SimpMessageHeaderAccessor smha) {
        throw new UnsupportedOperationException("Not implemented");
    }
    
    @MessageMapping("/operator.release")
    // @SendTo("/broadcast/all-ops")
    public Envelope releaseChat(@Payload Envelope.ReleaseChat msgLock,
                               SimpMessageHeaderAccessor smha) {
        throw new UnsupportedOperationException("Not implemented");
    }
    
    /// private methods
    
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

    /**
     * Fills current websocket session attribute with given id (sorta conversation context)
     * Using it later when any message arrives to know who sends this message
     * @param smha
     * @param id
     */
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
