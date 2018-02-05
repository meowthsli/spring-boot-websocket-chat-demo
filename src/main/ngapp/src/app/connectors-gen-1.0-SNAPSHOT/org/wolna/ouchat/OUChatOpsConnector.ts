/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * 
     * @author yveretelnikov
     * @class
     */
    export interface OUChatOpsConnector extends org.wolna.ouchat.OUChatConnection {
        /**
         * Load chat history
         * @return
         * @param {string} clientID
         * @param {number} lastSeen
         * @return {org.wolna.ouchat.OUChatOperationResult}
         */
        loadHistory(clientID : string, lastSeen : number) : org.wolna.ouchat.OUChatOperationResult;

        /**
         * 
         * @param {string} text
         * @return
         * @return {org.wolna.ouchat.OUChatOperationResult}
         */
        say(text : string) : org.wolna.ouchat.OUChatOperationResult;
    }
}

