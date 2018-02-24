package org.wolna.ouchatserver.model;

import java.util.Collection;
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
    long addMessage(String clientLogin, String message);
    
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
    void lockConversation(String clientLogin);
}
