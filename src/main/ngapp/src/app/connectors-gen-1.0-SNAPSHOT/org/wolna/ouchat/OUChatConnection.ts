/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * 
     * @author yveretelnikov
     * @class
     */
    export interface OUChatConnection {
        /**
         * Open connection to server.
         * @param {string} uri Url to server [relative]
         * @param {string} login email OR token
         * @param {string} password password OR token
         * @return {org.wolna.ouchat.OUChatOperationResult} true if success
         */
        connect(uri : string, login : string, password : string) : org.wolna.ouchat.OUChatOperationResult;

        /**
         * Close connection to server
         * @return {org.wolna.ouchat.OUChatOperationResult}
         */
        disconnect() : org.wolna.ouchat.OUChatOperationResult;

        /**
         * Checks connection status
         * @return {boolean}
         */
        isConnected() : boolean;

        /**
         * Accepts message handler
         * @param {*} x
         * @return {boolean}
         */
        onMessage(x : (p1: org.wolna.ouchat.Parcel) => void) : boolean;
    }
}

