/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchat;

/**
 *
 * @author yurij
 */
public interface OUChatConnector {
    public boolean connect(String uri, String login, String password);
    public boolean disconnect();
    
    public void loadHistory();
    
    public void say(String text);
}
