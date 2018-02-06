package org.wolna.ouchat;

/**
 * Envelope for transport messages
 * @author yveretelnikov
 */
public class Parcel {
    public static final class ClientHello {        
    }

    public static final class ClientConnected {
        public String clientID;
    }

    public static final class MessageDelivered {
        public int operationId;
    }
}
