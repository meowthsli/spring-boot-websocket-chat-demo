package org.wolna.ouchat;

/**
 * Envelope for transport messages
 * @author yveretelnikov
 */
public class Parcel {
    /**
     * Client sends when makes connection
     */
    public static final class ClientHello {
        public final UserDescription desc;

        public ClientHello(UserDescription desc){
            assert desc != null : "desc@UserDescription cannot be null";
            if(desc == null) {
                throw new IllegalArgumentException("desc cannot be null");
            }

            this.desc = desc;
        }
    }

    public static final class ClientConnected {
        public String clientID;
    }

    /**
     * Message delivering confirmation. Has to be sent from server to client
     */
    public static final class MessageDelivered {
        public long operationId;
        public long messageId;
        public MessageDelivered(long operationId, long messageId) {
            this.operationId = operationId;
            this.messageId = messageId;
        }
    }

    /**
     * Request to load history from server
     */
    public static final class HistoryRequest {
        public final long lastSeenId;
        /**
         *
         * @param lastSeenId id of last message seen
         */
        public HistoryRequest(long lastSeenId) {
            this.lastSeenId = lastSeenId;
        }
    }

    /**
     * User description
     */
    public static class UserDescription {
        public final String fio;
        public final String userLogin;
        public final String[] tags;
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
    }
}
