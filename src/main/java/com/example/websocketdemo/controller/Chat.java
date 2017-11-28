/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.websocketdemo.controller;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author yurij
 */
public class Chat {
    public String userID;
    
    public final List<Chat.Item> items = new ArrayList<>();
    
    public final class Item {
        
    }
    
    public Item[] getLastN(int n) {
        return new Item[0];
    }
}
