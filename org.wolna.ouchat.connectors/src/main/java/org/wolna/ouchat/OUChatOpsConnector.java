package org.wolna.ouchat;

/**
 *
 * @author yveretelnikov
 */
public interface OUChatOpsConnector extends OUChatConnection {
    /**
     * Load chat history
     * @return
     */
    public OUChatOperationResult loadHistory(String clientID, int lastSeen);

    /**
     *
     * @param text
     * @return
     */
    public OUChatOperationResult say(String text);
}
