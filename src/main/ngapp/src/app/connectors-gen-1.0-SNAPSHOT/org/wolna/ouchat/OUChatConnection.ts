/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
import { Envelope } from './Envelope';

/**
 * 
 * @author yveretelnikov
 * @class
 */
export interface OUChatConnection {
    /**
     * Open connection to server.
     * @param {string} uri Url to server [relative]
     * @param {string} key api key OR jwt token
     * @return {boolean} true if success
     * @param {Envelope.UserDescription} description
     */
    connect(uri : string, key : string, description : Envelope.UserDescription) : boolean;

    /**
     * Close connection to server
     * @return {boolean}
     */
    disconnect() : boolean;

    /**
     * Checks connection status
     * @return {boolean}
     */
    isConnected() : boolean;

    /**
     * Accepts incoming message handler
     * @param x
     * @param {*} handler
     * @return {boolean}
     */
    onResult(handler : (p1: Envelope) => void) : boolean;

    /**
     * Accepts error handler
     * @param {*} handler
     * @return
     * @return {boolean}
     */
    onError(handler : (p1: Envelope) => void) : boolean;

    /**
     * Connection event handler
     * @param {*} handler
     * @return
     * @return {boolean}
     */
    onConnected(handler : (p1: any) => void) : boolean;
}


