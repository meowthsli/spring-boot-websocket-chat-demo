package org.wolna.ouchat;

/**
 *
 * @author yveretelnikov
 */
public interface OUChatOpsConnector extends OUChatConnection {
    /**
     * Load chat history
     * @return operation id
     */
    public int loadHistory(String clientID, int lastSeen);

    /**
     * Send message to chat
     * @param clientID Id of chat/client
     * @param text Message
     * @return operation id
     */
    public int say(String clientID, String text);

    /**
     * Try to lock chat
     * @param clientID
     * @return operation id
     */
    public int tryAcquireChat(String clientID);

    /**
     * Release locked chat
     * @param clientID
     * @return operation id
     */
    public int releaseChat(String clientID);
}
