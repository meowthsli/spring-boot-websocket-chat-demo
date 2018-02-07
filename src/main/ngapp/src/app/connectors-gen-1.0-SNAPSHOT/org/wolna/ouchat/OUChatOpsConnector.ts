/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
import { OUChatConnection } from './OUChatConnection';

/**
 * 
 * @author yveretelnikov
 * @class
 */
export interface OUChatOpsConnector extends OUChatConnection {
    /**
     * Load chat history
     * @return {number} operation id
     * @param {string} clientID
     * @param {number} lastSeen
     */
    loadHistory(clientID : string, lastSeen : number) : number;

    /**
     * Send message to chat
     * @param {string} clientID Id of chat/client
     * @param {string} text Message
     * @return {number} operation id
     */
    say(clientID : string, text : string) : number;

    /**
     * Try to lock chat
     * @param {string} clientID
     * @return {number} operation id
     */
    tryAcquireChat(clientID : string) : number;

    /**
     * Release locked chat
     * @param {string} clientID
     * @return {number} operation id
     */
    releaseChat(clientID : string) : number;
}


