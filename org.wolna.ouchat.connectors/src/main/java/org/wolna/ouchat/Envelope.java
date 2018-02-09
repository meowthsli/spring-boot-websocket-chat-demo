package org.wolna.ouchat;

/**
 * Envelope for transport messages
 * @author yveretelnikov
 */
public class Envelope {

    public ClientHello clientHello;
    public MessageToServer messageToServer;
    public MessageAccepted messageAccepted;
    public ClientHelloOk clientHelloOk;

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
    public static final class ClientHelloOk {
        public long id;
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
    }

    /**
     * Message delivering confirmation. Has to be sent from server to client
     */
    public static final class MessageAccepted {
        public long messageId;
        public long messageTemporaryId;
        public MessageAccepted(long messageTemporaryId, long messageId) {
            this.messageTemporaryId = messageTemporaryId;
            this.messageId = messageId;
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
