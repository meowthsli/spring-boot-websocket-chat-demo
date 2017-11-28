package com.example.websocketdemo.model;

import com.example.websocketdemo.controller.Chat;

/**
 * Created by rajeevkumarsingh on 24/07/17.
 */
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private Chat.Item[][] items;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        OP_STARTED, // when operator logs in
        OP_UNREAD_LIST,
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
    
    public Chat.Item[][] getChatItems() {
        return this.items;
    }
    
    public void setChatItems(Chat.Item[][] items) {
        this.items = items;
    }
}
