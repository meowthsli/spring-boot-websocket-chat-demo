package org.wolna.ouchat;

/**
 * Operation execution result
 * @author yveretelnikov
 */
public class OUChatOperationResult {

    /**
     * Id of operation. Must not be null
     */
    public int operationId;

    /**
     * Message (if any)
     */
    public Parcel resultMessage;

    /**
     * Error code or 0
     */
    public int errorCode = 0;

    /**
     * Error description or null
     */
    public String errorDescription;

    /**
     * When connection is not established
     */
    public static final int ERROR_NOT_CONNECTED = 1;

    /**
     * When operation in not valid
     */
    public static final int ERROR_INVALID_OPERATION = 2;

    /**
     * When disconnected
     */
    public static final int ERROR_DISCONNETED = 3;
    
    /**
     * Unknown error
     */
    public static final int GENERIC_ERROR = 1000;
}