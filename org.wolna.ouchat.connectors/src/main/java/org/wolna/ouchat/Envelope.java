package org.wolna.ouchat;

import java.util.Date;

/**
 * Envelope for transport messages
 * @author yveretelnikov
 */
public class Envelope {

    // Answers to client
    public MessageAccepted messageAccepted;
    public HelloOk helloOk;
    public LoadHistoryResp loadHistoryResp;
    public OkTryLockChat tryLockChat;
    public OkReleaseChat releaseChat;
    public MessageFromClient clientMessage;
    public OpHello opHello;
    public Info info;

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
        public long ok = 1;
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
     * Message to load client history from server
     */
    public static class LoadHistoryOp {
        public long lastSeenMessage;
        public String clientLogin;
        public LoadHistoryOp(String clientLogin, long lastSeenMessage) {
            this.lastSeenMessage = lastSeenMessage;
            this.clientLogin = clientLogin;
        }
        
        /**
         * Internal. Do notuse
         */
        protected LoadHistoryOp() {}
    }
    
    /**
     * History messages
     */
    public static class LoadHistoryResp {
        public final TextMessage[] messages;
        public final String userLogin;
        public LoadHistoryResp(TextMessage[] messages, String userLogin) {
            this.messages = messages;
            this.userLogin = userLogin;
        }
    }
    
    /**
     * Message to load client history from server
     */
    public static class MessageFromClient {
        public TextMessage message;
        public String clientID;
        public MessageFromClient(String clientID, TextMessage message) {
            this.message = message;
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected MessageFromClient() {}
    }
    
    public static class TryLockChat {
        
        public String clientID;
        public TryLockChat(String clientID) {
            assert clientID != null;
            if(clientID == null) {
                throw new IllegalArgumentException("@clientID can not be null");
            }
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected TryLockChat() {}
    }
    
    public static class OkTryLockChat {
        
        public String clientID;
        public OkTryLockChat(String clientID) {
            assert clientID != null;
            if(clientID == null) {
                throw new IllegalArgumentException("@clientID can not be null");
            }
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected OkTryLockChat() {}
    }
    
    public static class ReleaseChat {
        
        public String clientID;
        public ReleaseChat(String clientID) {
            assert clientID != null;
            if(clientID == null) {
                throw new IllegalArgumentException("@clientID can not be null");
            }
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected ReleaseChat() {}
    }
    
    public static class OkReleaseChat {
        
        public String clientID;
        public OkReleaseChat(String clientID) {
            assert clientID != null;
            if(clientID == null) {
                throw new IllegalArgumentException("@clientID can not be null");
            }
            this.clientID = clientID;
        }

        /**
         * Internal. Do not use
         */
        protected OkReleaseChat() {}
    }
    
    public static class InfoRequest {
        public String clientID;
        public InfoRequest(String clientID) {
            this.clientID = clientID;
        }
        
        protected InfoRequest() {}
    }
    
    public static class Info {
        public UserDescription description;
        public Info(UserDescription desc) {
            this.description = desc;
        }
        
        protected Info() {}
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
        /** When command cant be ran due to wrong state */
        public static final int ERROR_WRONG_STATE = 4;
        /**Unknown error */
        public static final int GENERIC_ERROR = 1000;
        /**
         * Error description or null
         */
        public String errorDescription;
    }
    
    public static class TextMessage {

        public long id;
        public String text;
        public boolean fromClient;
        public Date dateAt;
        
        protected TextMessage() {
            
        }
        
        public TextMessage(long id, String text, boolean fromClient, Date createdAt) {
            this.id = id;
            this.text = text;
            this.fromClient = fromClient;
            this.dateAt = createdAt;    
        }
    }
}
