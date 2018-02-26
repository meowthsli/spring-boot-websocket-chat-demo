package org.wolna.ouchatserver.controller;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.wolna.ouchat.Envelope;
import org.wolna.ouchat.Envelope.ClientHello;
import org.wolna.ouchat.Envelope.HelloOk;
import org.wolna.ouchatserver.model.Conversations;
import org.wolna.ouchatserver.model.Message;

/**
 * Created by on 24/07/17.
 */
@Controller
public class ChatController {

    static Log LOG = LogFactory.getLog(ChatController.class);

    @Autowired
    private SimpMessagingTemplate sender;
    
    @Autowired
    Conversations storage;

    /**
     * New op is here
     *
     * @param hello
     * @param who
     * @param smha
     * @return hello to all connected ops
     */
    @MessageMapping("/client.hello")
    @SendTo("/broadcast/all-ops")
    public ClientHello clientHello(@Payload ClientHello hello,
            SimpMessageHeaderAccessor smha,
            Authentication /*ApiKeyAuthenticationToken*/ who) {
        // init meta
        storage.initConversation(hello.desc, clientLogin(who), apiKey(who));

        // send back OK
        sender.convertAndSendToUser(clientLogin(who), "/queue/client", new HelloOk());

        return hello;
    }

    @MessageMapping("/client.say")
    @SendTo("/broadcast/all-ops")
    public Envelope.MessageToServer clientSay(@Payload Envelope.MessageToServer chatMessage,
            SimpMessageHeaderAccessor smha, Authentication who) {
        long id = storage.addClientMessage(clientLogin(who), chatMessage.text);

        // send back acceptance
        Envelope e = new Envelope();
        e.messageAccepted = new Envelope.MessageAccepted(chatMessage.temporaryId, id, Date.from(Instant.now()));
        sender.convertAndSendToUser(clientLogin(who), "/queue/client", e);

        return new Envelope.MessageToServer(chatMessage.text, id);
    }
    

    /**
     * TODO: load real history
     *
     * @param getHisto
     * @param smha
     * @param who
     * @return
     */
    @MessageMapping("/client.histo")
    @SendToUser("/queue/client")
    public Envelope clientHistory(@Payload Envelope.LoadHistory getHisto,
            SimpMessageHeaderAccessor smha, Authentication who) {
        Collection<Message> mm = storage.loadHistory(clientLogin(who), Long.MAX_VALUE);
        
        Envelope e = new Envelope();
        e.loadHistoryResp = new Envelope.LoadHistoryResp(
                mm.stream().map(x -> new Envelope.TextMessage(x.msgId, x.text, x.fromClient, Date.from(x.created)))
                        .collect(Collectors.toList()).toArray(new Envelope.TextMessage[0]),
                clientLogin(who));
        return e;
    }
    
    /// operator handlers
    /**
     * New op is here
     *
     * @param hello
     * @param smha
     * @param who
     */
    @MessageMapping("/op.hello")
    @SendTo("/broadcast/all-ops")
    public void operatorHello(@Payload Envelope.OpHello hello,
            SimpMessageHeaderAccessor smha, Authentication who) {
        sender.convertAndSendToUser(who.getPrincipal().toString(), "/queue/op", new HelloOk()); // example of send to client back
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
    private static String clientLogin(Authentication user) {
        return user.getPrincipal().toString();
    }

    private static String apiKey(Authentication who) {
        return who.getCredentials().toString();
    }
}
