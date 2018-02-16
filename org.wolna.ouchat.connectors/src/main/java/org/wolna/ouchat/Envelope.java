package org.wolna.ouchat;

import java.util.Date;

/**
 * Envelope for transport messages
 * @author yveretelnikov
 */
public class Envelope {

    public MessageToServer messageToServer;
    public MessageAccepted messageAccepted;
    public HelloOk clientHelloOk;
    public LoadHistoryResp loadClientHistoryResp;

    /**
     * Client sends when makes connection
     */
    public static final class ClientHello {
        public UserDescription desc;

        public ClientHello(UserDescription desc){
            assert desc != null : "desc@UserDescription cannot be null";
            if(desc == null) {
                throw new IllegalArgumentException("desc cannot be null");
            }

            this.desc = desc;
        }

        protected ClientHello() {}
    }

    /**
     * Response from server to client hello
     */
    public static final class HelloOk {
        public long id = 1;
    }
    
    /**
     * Message sent to server with temp id
     */
    public static final class MessageToServer {
        public String text;
        public long temporaryId;

        public MessageToServer(String text, long temporaryId) {
            assert text != null;
            if(text == null) {
                throw new IllegalArgumentException("text cannot be null");
            }
            this.text = text;
            this.temporaryId = temporaryId;
        }

        /**
         * Internal. Do not use
         */
        protected MessageToServer() {

        }
    }

    /**
     * Message delivering confirmation. Has to be sent from server to client
     */
    public static final class MessageAccepted {
        public long messageId;
        public long messageTemporaryId;
        public Date when;
        public MessageAccepted(long messageTemporaryId, long messageId, Date when) {
            this.messageTemporaryId = messageTemporaryId;
            this.messageId = messageId;
            this.when = when;
        }
    }

    // Op messages

    public static final class OpHello {
        public UserDescription desc;

        public OpHello(UserDescription desc){
            assert desc != null : "desc@UserDescription cannot be null";
            if(desc == null) {
                throw new IllegalArgumentException("desc cannot be null");
            }

            this.desc = desc;
        }

        protected OpHello() {}
    }

    /**
     * Message sent to server with temp id and client target
     */
    public static final class MessageToServerOp {
        public String text;
        public long temporaryId;
        public String clientID;

        public MessageToServerOp(String clientID, String text, long temporaryId) {
            assert text != null && clientID != null;
            if(text == null) {
                throw new IllegalArgumentException("@text cannot be null");
            }

            if(clientID == null) {
                throw new IllegalArgumentException("@clientID cannot be null");
            }
            this.text = text;
            this.temporaryId = temporaryId;
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected MessageToServerOp() {

        }
    }

    /**
     * User description
     */
    public static class UserDescription {
        public String fio;
        public String userLogin;
        public String[] tags;
        public UserDescription(String userLogin, String fio, String[] tags) {
            assert fio != null;
            assert tags != null;
            if(tags == null) {
                tags = new String[0];
            }

            this.fio = fio;
            this.userLogin= userLogin;
            this.tags = tags;
        }

        protected UserDescription() {}
    }
    
    /**
     * Message to load client history from server
     */
    public static class LoadHistory {
        public long lastSeenMessage;
        public LoadHistory(long lastSeenMessage) {
            this.lastSeenMessage = lastSeenMessage;
        }
        
        /**
         * Internal. Do not use
         */
        protected LoadHistory() {}
    }
    
    /**
     * History messages
     */
    public static class LoadHistoryResp {
        public String[] messages;
        public LoadHistoryResp(String[] messages) {
            this.messages = messages;
        }
    }

    /**
     * Message to load client history from server
     */
    public static class LoadHistoryOp {
        public long lastSeenMessage;
        public String clientID;
        public LoadHistoryOp(String clientID, long lastSeenMessage) {
            this.lastSeenMessage = lastSeenMessage;
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected LoadHistoryOp() {}
    }

    public static class Response extends Envelope {
        /**
        * Error code. 0 for success
        */
        public long errorCode = 0;
          /** When connection is not established */
        public static final int ERROR_NOT_CONNECTED = 1;
        /** When operation in not valid */
        public static final int ERROR_INVALID_OPERATION = 2;
        /** When disconnected */
        public static final int ERROR_DISCONNECTED = 3;
        /**Unknown error */
        public static final int GENERIC_ERROR = 1000;
        /**
         * Error description or null
         */
        public String errorDescription;
    }
}
