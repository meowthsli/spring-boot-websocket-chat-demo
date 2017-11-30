package com.example.websocketdemo.model;

import com.example.websocketdemo.controller.Chat;

/**
 * Created by rajeevkumarsingh on 24/07/17.
 */
public class Parcel {

    public static Parcel makeUnreadList(String userID, Chat.Item[] lastN) {
        Parcel p = new Parcel();
        p.setType(MessageType.OP_UNREAD_LIST);
        p.setSender(userID);
        p.setChatItems(lastN);
        return p;
    }

    public static Parcel hello(String sender) {
        Parcel p = new Parcel();
        p.setSender(sender);
        p.setType(MessageType.OP_HELLO);
        return p;
    }
    private MessageType type;
    private String userID;
    private Chat.Item[] items;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        OP_HELLO, // when operator logs in
        OP_UNREAD_LIST,
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
}
