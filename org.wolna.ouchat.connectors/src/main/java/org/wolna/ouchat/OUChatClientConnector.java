/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchat;

/**
 * Connector protocol
 * @author yurij
 */
public interface OUChatClientConnector extends OUChatConnection {

    /**
     * Load chat history
     * @return
     */
    public OUChatOperationResult loadHistory(int lastSeen);

    /**
     *
     * @param text
     * @return
     */
    public OUChatOperationResult say(String text);
}
