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
import org.wolna.ouchat.Envelope.Response;
import org.wolna.ouchatserver.model.Conversations;
import org.wolna.ouchatserver.model.Message;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl.SecurityUser;

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
    
    @Autowired
    ClientInfo clientInfo;

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
        clientInfo.updateInfo(clientLogin(who), hello.desc);

        // send back OK
        sender.convertAndSendToUser(clientLogin(who), "/queue/client", new HelloOk());

        return hello;
    }

    @MessageMapping("/client.say")
    @SendTo("/broadcast/all-ops")
    public Envelope clientSay(@Payload Envelope.MessageToServer chatMessage,
            SimpMessageHeaderAccessor smha, Authentication who) {
        long id = storage.addClientMessage(clientLogin(who), chatMessage.text);

        // send back acceptance
        Envelope e = new Envelope();
        e.messageAccepted = new Envelope.MessageAccepted(chatMessage.temporaryId, id, Date.from(Instant.now()));
        sender.convertAndSendToUser(clientLogin(who), "/queue/client", e);

        Envelope oe = new Envelope();
        oe.clientMessage = new Envelope.MessageFromClient(clientLogin(who),
                new Envelope.TextMessage(id, chatMessage.text, true, Date.from(e.messageAccepted.when.toInstant()))
        );
        return oe;
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
        Collection<Message> mm = storage.loadHistory(clientLogin(who), getHisto.lastSeenMessage);

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
     * @return
     */
    @MessageMapping("/op.hello")
    @SendTo("/broadcast/all-ops")
    public Envelope operatorHello(@Payload Envelope.OpHello hello,
            SimpMessageHeaderAccessor smha, Authentication who) {
        sender.convertAndSendToUser(opsLogin(who), "/queue/op", new HelloOk()); // example of send to client back

        hello.desc.userLogin = opsLogin(who);

        Envelope e = new Envelope();
        e.opHello = hello;
        return e;
    }

    @MessageMapping("/op.histo")
    @SendToUser("/queue/op")
    public Envelope operatorHisto(@Payload Envelope.LoadHistoryOp opHisto,
            SimpMessageHeaderAccessor smha) {
        Collection<Message> mm = storage.loadHistory(opHisto.clientLogin, opHisto.lastSeenMessage);

        Envelope e = new Envelope();
        e.loadHistoryResp = new Envelope.LoadHistoryResp(
                mm.stream()
                        .map(x -> new Envelope.TextMessage(x.msgId, x.text, x.fromClient, Date.from(x.created)))
                        .collect(Collectors.toList())
                        .toArray(new Envelope.TextMessage[0]),
                opHisto.clientLogin);
        return e;
    }

    @MessageMapping("/op.say")
    @SendToUser("/queue/op")
    public void operatorSay(@Payload Envelope.MessageToServerOp chatMessage, SimpMessageHeaderAccessor smha) {
        long id = storage.addOpMessage(chatMessage.clientID, chatMessage.text);

        // send back acceptance
        Envelope e = new Envelope();
        e.messageAccepted = new Envelope.MessageAccepted(chatMessage.temporaryId, id, Date.from(Instant.now()));
        sender.convertAndSendToUser(chatMessage.clientID, "/queue/client", e);
    }
    
    @MessageMapping("/op.info")
    @SendTo("/broadcast/all-ops")
    public Response operatorInfo(@Payload Envelope.InfoRequest infoRequest, SimpMessageHeaderAccessor smha) {
        
        // send back acceptance
        Response e = new Response();
        e.info = new Envelope.Info(this.clientInfo.loadInfo(infoRequest.clientID));
        return e;
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

    private static String opsLogin(Authentication user) {
        return ((SecurityUser)user.getPrincipal()).getUser().getEmail();
    }
}
