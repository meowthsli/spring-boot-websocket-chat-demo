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
         * @return {number} Operation id
         * @param {number} lastSeen
         */
        loadHistory(lastSeen : number) : number;

        /**
         * 
         * @param {string} text
         * @return {number} Оperation id
         */
        say(text : string) : number;
    }
}

