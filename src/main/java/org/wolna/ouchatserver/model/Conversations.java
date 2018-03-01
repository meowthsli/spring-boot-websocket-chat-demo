package org.wolna.ouchatserver.model;

import java.util.Collection;
import java.util.List;
import org.wolna.ouchat.Envelope;

/**
 * Conversations storage
 * 
 * @author yurij
 */
public interface Conversations {
    /**
     * Begin conversation. Creates if not exists
     * @param client 
     */
    void initConversation(Envelope.UserDescription client, String who, String apiKey);
    
    /**
     * Update conversation with data
     * 
     * @param clientLogin
     * @param operator 
     */
    void updateOperator(String clientLogin, Envelope.UserDescription operator);
    
    /**
     * Add message to conversation
     * @param clientLogin
     * @param message 
     */
    long addClientMessage(String clientLogin, String message);
    
    /**
     * Loads messages
     * @param clientLogin
     * @param lastSeenId
     * @return 
     */
    Collection<Message> loadHistory(String clientLogin, Long lastSeenId);
    
    
    /**
    * Working with conversations
     * @param clientLogin
    */
    void lock(String clientLogin, String operatorLogin);
    
    void release(String clientLogin);
    
    String whoLocked(String clientLogin);

    /**
     * Add message to conversation
     * @param clientLogin
     * @param message 
     */
    long addOpMessage(String clientLogin, String message);

    /**
     * Searches by fio
     * @param user
     * @return list of client ids 
     */
    public List<String> search(String fio);
}
