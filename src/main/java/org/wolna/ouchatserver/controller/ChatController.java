package org.wolna.ouchatserver.controller;

import java.time.Instant;
import java.util.AbstractMap;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.wolna.ouchat.Envelope;
import org.wolna.ouchat.Envelope.ClientHello;
import org.wolna.ouchat.Envelope.HelloOk;
import org.wolna.ouchat.Envelope.Response;
import org.wolna.ouchat.Envelope.TextMessage;
import org.wolna.ouchatserver.model.ApiKeyRepository;
import org.wolna.ouchatserver.model.Conversations;
import org.wolna.ouchatserver.model.Events;
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
    
    @Autowired
    ApiKeyRepository repo;
    
    @Autowired
    ApplicationEventPublisher publisher;

    /**
     * New op is here
     *
     * @param hello
     * @param who
     * @param smha
     */
    @MessageMapping("/client.hello")
    public void clientHello(@Payload ClientHello hello,
            SimpMessageHeaderAccessor smha,
            Authentication /*ApiKeyAuthenticationToken*/ who) {
        // init meta
        storage.initConversation(hello.desc, clientLogin(who), apiKey(who));
        if(hello.desc == null) {
            throw new IllegalArgumentException("@hello.desc is null");
        }
        clientInfo.updateInfo(clientLogin(who), hello.desc);

        // send back OK
        Response r = new Response();
        r.helloOk = new HelloOk();
        sender.convertAndSendToUser(clientLogin(who), "/queue/client", r);

        // forwart hello to all connected ops
        sender.convertAndSend("/broadcast/all-ops/" + this.repo.findCompanyIdByKeyValue(apiKey(who)), hello);
        
        publisher.publishEvent(new Events.UserConnected());
    }

    @MessageMapping("/client.say")
    public void clientSay(@Payload Envelope.MessageToServer chatMessage,
            SimpMessageHeaderAccessor smha, Authentication who) {
        long id = storage.addClientMessage(clientLogin(who), chatMessage.text);

        // send back acceptance to source client
        Envelope e = new Envelope();
        e.messageAccepted = new Envelope.MessageAccepted(chatMessage.temporaryId, id, Date.from(Instant.now()));
        sender.convertAndSendToUser(clientLogin(who), "/queue/client", e);

        Response oe = new Response();
        oe.clientMessage = new Envelope.MessageFromClient(clientLogin(who),
                new Envelope.TextMessage(id, chatMessage.text, true, Date.from(e.messageAccepted.when.toInstant()))
        );
        // TODO: check if locked then do not send to ops, but only to conv owner
        String op = this.storage.whoLocked(clientLogin(who));
        if(op == null) {
            sender.convertAndSend("/broadcast/all-ops/" +  this.repo.findCompanyIdByKeyValue(apiKey(who)), oe);
        } else {
            sender.convertAndSendToUser(op, "/queue/op", oe);
        }
        
        publisher.publishEvent(new Events.MessageArrived());
    }

    @MessageMapping("/client.putfile")
    @SendToUser("/queue/client")
    public Response putClientFile(@Payload Envelope.FileMessageToServer fileMessage,
            SimpMessageHeaderAccessor smha, Authentication client) {
        
        Response r = uploadFile(fileMessage, clientLogin(client), true);

        Response ftm = new Response();
        ftm.messages = new Envelope.MessagesArrived(new TextMessage[0],                
                new Envelope.FileTextMessage[]{
                    new Envelope.FileTextMessage(r.fileMessageAccepted.messageId, 
                        true, fileMessage.filename, 
                        r.fileMessageAccepted.when, 
                        r.fileMessageAccepted.contentReference)
                },
                clientLogin(client)
                );
        String op = this.storage.whoLocked(clientLogin(client));
        if(op == null) {
            sender.convertAndSend("/broadcast/all-ops/" +  this.repo.findCompanyIdByKeyValue(apiKey(client)), ftm);
        } else {
            sender.convertAndSendToUser(op, "/queue/op", ftm);
        }

        publisher.publishEvent(new Events.MessageArrived());
        return r;
    }
    
    @MessageMapping("/op.putfile")
    @SendToUser("/queue/op")
    public Response putOpFile(@Payload Envelope.FileMessageToServerOp fileMessage,
            SimpMessageHeaderAccessor smha, Authentication op) {
        
        Response r = uploadFile(fileMessage, opsLogin(op), false);

        Response msg = new Response();
        msg.messages = new Envelope.MessagesArrived(
               new TextMessage[0],
                new Envelope.FileTextMessage[]{
                    new Envelope.FileTextMessage(r.fileMessageAccepted.messageId,
                        true, fileMessage.filename,
                        r.fileMessageAccepted.when,
                        r.fileMessageAccepted.contentReference)
                },
                fileMessage.clientID);
        sender.convertAndSendToUser(fileMessage.clientID, "/queue/client", msg);
        
        publisher.publishEvent(new Events.MessageArrived());
        return r;
    }
    
    @MessageMapping("/client.getfile")
    @SendToUser("/queue/client")
    public Response getClientFile(@Payload Envelope.RequestFileContent fileRequest,
            SimpMessageHeaderAccessor smha, Authentication op) {
        return getFile(fileRequest);
    }
    
    @MessageMapping("/op.getfile")
    @SendToUser("/queue/op")
    public Response getOpFile(@Payload Envelope.RequestFileContent fileRequest,
            SimpMessageHeaderAccessor smha, Authentication op) {
        return getFile(fileRequest);
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
        e.messages = new Envelope.MessagesArrived(
                mm.stream()
                        .filter(x -> x.contentReference == null)
                        .map(x -> new Envelope.TextMessage(x.msgId, x.text, x.fromClient, Date.from(x.created)))
                        .collect(Collectors.toList()).toArray(new Envelope.TextMessage[0]),
                mm.stream()
                        .filter(x -> x.contentReference != null)
                        .map(x -> new Envelope.FileTextMessage(x.msgId, x.fromClient, x.text, Date.from(x.created), x.contentReference))
                        .collect(Collectors.toList()).toArray(new Envelope.FileTextMessage[0]),
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
    public void operatorHello(@Payload Envelope.OpHello hello,
            SimpMessageHeaderAccessor smha, Authentication who) {
        sender.convertAndSendToUser(opsLogin(who), "/queue/op", new HelloOk()); // example of send to client back

        hello.desc.userLogin = opsLogin(who);

        Response e = new Response();
        e.opHello = hello;
        
        sender.convertAndSend("/broadcast/all-ops/" + company(who), e);
    }

    @MessageMapping("/op.histo")
    @SendToUser("/queue/op")
    public Envelope operatorHisto(@Payload Envelope.LoadHistoryOp opHisto,
            SimpMessageHeaderAccessor smha) {
        Collection<Message> mm = storage.loadHistory(opHisto.clientLogin, opHisto.lastSeenMessage);

        Envelope e = new Envelope();
        e.messages = new Envelope.MessagesArrived(
                mm.stream()
                        .filter(x -> x.contentReference == null)
                        .map(x -> new Envelope.TextMessage(x.msgId, x.text, x.fromClient, Date.from(x.created)))
                        .collect(Collectors.toList()).toArray(new Envelope.TextMessage[0]),
                mm.stream()
                        .filter(x -> x.contentReference != null)
                        .map(x -> new Envelope.FileTextMessage(x.msgId, x.fromClient, x.text, Date.from(x.created), x.contentReference))
                        .collect(Collectors.toList()).toArray(new Envelope.FileTextMessage[0]),
                opHisto.clientLogin);
        return e;
    }

    @MessageMapping("/op.say")
    @SendToUser("/queue/op")
    public Response operatorSay(@Payload Envelope.MessageToServerOp chatMessage, 
            SimpMessageHeaderAccessor smha,
            Authentication who) {
        long id = storage.addOpMessage(chatMessage.clientID, chatMessage.text);

        // duplicate message to client
        Date d = Date.from(Instant.now());
        Response msg = new Response();
        msg.messages = new Envelope.MessagesArrived(
                new Envelope.TextMessage[]{new Envelope.TextMessage(id, chatMessage.text, false, d)},
                new Envelope.FileTextMessage[0],
                chatMessage.clientID);
        sender.convertAndSendToUser(chatMessage.clientID, "/queue/client", msg);
        
        // check if locked, then do not send to every to all ops
        // sender.convertAndSend("/broadcast/all-ops/" + company(who), msg);
        
        // send back acceptance to source op
        Response e = new Response();
        e.messageAccepted = new Envelope.MessageAccepted(chatMessage.temporaryId, id, d);
        return e;
    }
    
    @MessageMapping("/op.info")
    public void operatorInfo(@Payload Envelope.InfoRequest infoRequest,
            SimpMessageHeaderAccessor smha, Authentication who) {
        
        // send back acceptance
        Response e = new Response();
        e.info = new Envelope.Info(this.clientInfo.loadInfo(infoRequest.clientID));
        
        // so if any of users asked for info
        sender.convertAndSend("/broadcast/all-ops/" + company(who), e);
    }

    @MessageMapping("/operator.tryLock")
    public void tryLockChat(@Payload Envelope.TryLockChat msgLock,
            SimpMessageHeaderAccessor smha, Authentication who) {
       this.storage.lock(msgLock.clientID, opsLogin(who));
       
       Response e = new Response();
       e.tryLockChat = new Envelope.OkTryLockChat(msgLock.clientID, opsLogin(who));
       sender.convertAndSend("/broadcast/all-ops/" + company(who), e);
    }

    @MessageMapping("/operator.release")
    public void releaseChat(@Payload Envelope.ReleaseChat msgLock,
              SimpMessageHeaderAccessor smha, Authentication who) {
       this.storage.lock(msgLock.clientID, opsLogin(who));
       
       Response e = new Response();
       e.releaseChat = new Envelope.OkReleaseChat(msgLock.clientID);
       sender.convertAndSend("/broadcast/all-ops/" + company(who), e); // do we really need it?
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
    
    private static String company(Authentication user) {
        return ((SecurityUser)user.getPrincipal()).getUser().company.getId().toString();
    }

    private Response uploadFile(Envelope.FileMessageToServer fileMessage, String login, boolean client) {
        AbstractMap.SimpleEntry<Long, String> res;
        if(client) {
            res = storage.addClientFile(login, fileMessage.filename, fileMessage.content);
        } else {
            res = storage.addOpFile(login, fileMessage.filename, fileMessage.content);
        }
        Response r = new Response();
        r.fileMessageAccepted = new Envelope.FileMessageAccepted(
                res.getValue(),
                fileMessage.temporaryId, res.getKey(), 
                Date.from(Instant.now())
        );
        return r;
    }

    private Response uploadFile(Envelope.FileMessageToServerOp fileMessage, String login, boolean client) {
        AbstractMap.SimpleEntry<Long, String> res;
        if(client) {
            res = storage.addClientFile(login, fileMessage.filename, fileMessage.content);
        } else {
            res = storage.addOpFile(login, fileMessage.filename, fileMessage.content);
        }
        Response r = new Response();
        r.fileMessageAccepted = new Envelope.FileMessageAccepted(
                res.getValue(),
                fileMessage.temporaryId, res.getKey(),
                Date.from(Instant.now())
        );
        return r;
    }

    private Response getFile(Envelope.RequestFileContent fileRequest) {
        AbstractMap.SimpleEntry<String, String> bt = storage.findFile(fileRequest.contentReference);
        
        Response r = new Response();
        r.fileContent = new Envelope.FileContent(
                fileRequest.contentReference, 
                bt.getKey(),
                bt.getValue()
        );
        return r;
    }
}
