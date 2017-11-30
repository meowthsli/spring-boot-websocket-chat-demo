package com.example.websocketdemo.model;

import com.example.websocketdemo.controller.Chat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.Collection;
import java.util.Deque;

/**
 * Created by on 24/07/17.
 */
@JsonInclude(Include.NON_NULL)
public class Parcel {

    public static Parcel makeUnreadList(String userID, Chat.Item[] lastN) {
        Parcel p = new Parcel();
        p.setType(MessageType.OP_UNREAD_LIST);
        p.setSender(userID);
        p.setChatItems(lastN);
        return p;
    }

    public static Parcel helloOp(String sender) {
        Parcel p = new Parcel();
        p.setSender(sender);
        p.setType(MessageType.OP_HELLO);
        return p;
    }
    
    public static Parcel helloCli(String sender) {
        Parcel p = new Parcel();
        p.setSender(sender);
        p.setType(MessageType.CLI_HELLO);
        return p;
    }

    public static Parcel makeClientMessages(String sender, Chat.Item[] history) {
        Parcel p = new Parcel();
        p.setSender(sender);
        p.setType(MessageType.CLI_HISTORY);
        return p;
    }

    public static Object ack(int id) {
        Parcel p = new Parcel();
        p.setType(MessageType.MSG_ACK);
        p.setAck(id);
        return p;
    }
    
    private MessageType type;
    private String userID;
    private Chat.Item[] items;
    private String text;
    private String to;
    private long ack;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        OP_HELLO, // when operator logs in
        CLI_HELLO,
        OP_UNREAD_LIST,
        CLI_HISTORY,
        MSG_ACK,
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getSender() {
        return userID;
    }

    public void setSender(String userID) {
        this.userID = userID;
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
    
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    public void setAck(long ack) {
        this.ack = ack;
    }
    
    public long getAck() {
        return ack;
    }
}
