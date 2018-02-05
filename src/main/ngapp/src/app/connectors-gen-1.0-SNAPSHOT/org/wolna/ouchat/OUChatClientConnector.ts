/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * Connector protocol
     * @author yurij
     * @class
     */
    export interface OUChatClientConnector extends org.wolna.ouchat.OUChatConnection {
        /**
         * Load chat history
         * @return
         * @param {number} lastSeen
         * @return {org.wolna.ouchat.OUChatOperationResult}
         */
        loadHistory(lastSeen : number) : org.wolna.ouchat.OUChatOperationResult;

        /**
         * 
         * @param {string} text
         * @return
         * @return {org.wolna.ouchat.OUChatOperationResult}
         */
        say(text : string) : org.wolna.ouchat.OUChatOperationResult;
    }
}

