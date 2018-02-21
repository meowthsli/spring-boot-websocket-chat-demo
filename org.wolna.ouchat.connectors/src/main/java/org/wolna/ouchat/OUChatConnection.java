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
     * @param login
     * @param key api key OR jwt token
     * @return true if success
     */
    public boolean connect(String uri, String key, Envelope.UserDescription description);

    /**
     * Close connection to server
     */
    public boolean disconnect();

     /**
     * Checks connection status
     */
    public boolean isConnected();

    /**
     * Accepts incoming message handler
     * @param x
     */
    public boolean onResult(Consumer<Envelope> handler);

    /**
     * Accepts error handler
     * @param handler
     * @return
     */
    public boolean onError(Consumer<Envelope> handler);

    /**
     * Connection event handler
     * @param handler
     * @return
     */
    public boolean onConnected(Consumer<Object> handler);
}
