package org.wolna.ouchat;

/**
 * Envelope for transport messages
 * @author yveretelnikov
 */
public class Parcel {
    public static final class ClientHello {
        public UserDescription desc;
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

    public static class UserDescription {
        public final String description;
        public final String userId;
        public UserDescription(String userId, String desc) {
            assert desc != null;
            this.description = desc;
            this.userId = userId;
        }
    }


}
