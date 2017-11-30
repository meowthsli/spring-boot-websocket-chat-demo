/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.websocketdemo.controller;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayDeque;
import java.util.Deque;

/**
 *
 * @author yurij
 */
public class Chat {
    public String userID = "cGFzc3dvcmQ=";
    
    public Chat() {
        this.history.addFirst(new Item(1, "Hello? Is anybody here", ZonedDateTime.now(), false));
        this.history.addFirst(new Item(2, "Yes we are here", ZonedDateTime.now(), true));
    }
    
    public final Deque<Chat.Item> history = new ArrayDeque<>();
    
    public final class Item {
        
        public Item(int id, String text, ZonedDateTime at, boolean isClient) {
            this.id = id;
            this.text = text;
            this.at = at;
            this.isClient = isClient;
        }
        public String text;
        public ZonedDateTime at;
        public boolean isClient;
        public long id;
    }
    
    public Item[] getLastN(int n) {
        return history.stream().limit(n).toArray(Item[]::new);
    }
    
}
