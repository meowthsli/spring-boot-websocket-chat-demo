package org.wolna.ouchat;

/**
 *
 * @author yveretelnikov
 */
public interface OUChatOpsConnector extends OUChatConnection {
    /**
     * Load chat history
     * @param clientID client id
     * @param lastSeen id of last seen message
     */
    public long loadHistory(String clientID, int lastSeen);

    /**
     * Send message to chat
     * @param clientID Id of chat/client
     * @param text Message
     * @return operation id
     */
    public long say(String clientID, String text);

    /**
     * Try to lock chat
     * @param clientID
     * @return operation id
     */
    public long tryAcquireChat(String clientID);

    /**
     * Release locked chat
     * @param clientID
     * @return operation id
     */
    public long releaseChat(String clientID);
    
    /**
     * Request full client info
     * 
     * @param clientID  
     */
    void getInfo(String clientID);
}
