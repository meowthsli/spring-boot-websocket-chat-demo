package org.wolna.ouchat;

import java.util.function.Consumer;

/**
 *
 * @author yveretelnikov
 */
public interface OUChatConnection {
       /**
     * Open connection to server.
     * @param uri Url to server [relative]
     * @param login email OR token
     * @param password password OR token
     * @return true if success
     */
    public OUChatOperationResult connect(String uri, String login, String password);
    /**
     * Close connection to server
     */
    public OUChatOperationResult disconnect();

     /**
     * Checks connection status
     */
    public boolean isConnected();

    /**
     * Accepts message handler
     * @param x
     */
    public boolean onMessage(Consumer<Parcel> x);
}
