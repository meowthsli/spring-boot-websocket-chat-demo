package com.example.websocketdemo.model;

import com.example.websocketdemo.controller.Chat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.time.Instant;

/**
 * Created by on 24/07/17.
 */
@JsonInclude(Include.NON_NULL)
public class Parcel {

    public static Parcel makeUnreadList(String clientID, Chat.Item[] lastN) {
        Parcel p = new Parcel();
        p.setClientID(clientID);
        p.setType(MessageType.OP_UNREAD_LIST);
        p.setChatItems(lastN);
        return p;
    }

    public static Parcel helloOp(String opID) {
        Parcel p = new Parcel();
        p.setOpID(opID);
        p.setType(MessageType.OP_HELLO);
        return p;
    }

    public static Parcel helloCli(String clientID) {
        Parcel p = new Parcel();
        p.setClientID(clientID);
        p.setType(MessageType.CLI_HELLO);
        return p;
    }

    public static Parcel makeClientHistory(String userID, Chat.Item[] history) {
        Parcel p = new Parcel();
        p.setClientID(userID);
        p.setType(MessageType.CLI_HISTORY);
        p.setChatItems(history);
        return p;
    }
    
     public static Parcel makeLockOk(String clientID, String opID) {
        Parcel p = new Parcel();
        p.setClientID(clientID);
        p.setType(MessageType.LOCK_OK);
        p.setOpID(opID);
        return p;
    }
    
    /**
     * - type
     * - clientID
     * - chatItems [1]
     * @param clientID
     * @param item
     * @return 
     */
    public static Parcel makeChatMessage(String clientID, Chat.Item item, Long cid) {
        Parcel p = makeClientHistory(clientID, new Chat.Item[]{item});
        p.setType(MessageType.CHAT);
        p.setCid(cid);
        return p;
    }

    public static Object ack(Long cid, Long id, Instant when, String clientId) {
        Parcel p = new Parcel();
        p.setType(MessageType.MSG_ACK);
        p.setAck(id);
        p.setCid(cid);
        p.setWhen(when);
        p.setClientID(clientId);
        return p;
    }
    
    public static Object ack(Long cid, Long id, Instant when) {
        return ack(cid, id, when, null);
    }

    public static Parcel makeHisto(String clientID, Chat.Item[] toArray) {
        Parcel p = new Parcel();
        p.setClientID(clientID);
        p.setType(MessageType.CLI_HISTORY);
        p.setChatItems(toArray);
        return p;
    }

    private MessageType type;
    private String clientId;
    private Chat.Item[] items;
    private String text;
    private String to;
    private Long ack;
    private Long cid;
    private String opID;
    private Instant when;

    public void setWhen(Instant when) {
        this.when = when;
    }
    
    public Instant getWhen() {
        return this.when;
    }

    public enum MessageType {
        SAY,
        CHAT,
        OP_HELLO, // when operator logs in
        CLI_HELLO,
        OP_UNREAD_LIST,
        CLI_HISTORY,
        MSG_ACK,
        LOCK_OK,
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getClientID() {
        return clientId;
    }

    public void setClientID(String clientID) {
        this.clientId = clientID;
    }

    public String getOpID() {
        return opID;
    }

    public void setOpID(String opID) {
        this.opID = opID;
    }

    public Chat.Item[] getChatItems() {
        return this.items;
    }

    public void setChatItems(Chat.Item[] items) {
        this.items = items;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setAck(Long ack) {
        this.ack = ack;
    }

    public Long getAck() {
        return ack;
    }

    public Long getCid() {
        return this.cid;
    }

    public void setCid(Long cid) {
        this.cid = cid;
    }
}
