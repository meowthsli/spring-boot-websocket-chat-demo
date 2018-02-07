/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
import { Parcel } from './Parcel';
import { OUChatOperationResult } from './OUChatOperationResult';

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
     * @return {boolean} true if success
     * @param {Parcel.UserDescription} description
     */
    connect(uri : string, login : string, password : string, description : Parcel.UserDescription) : boolean;

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
    onResult(handler : (p1: OUChatOperationResult) => void) : boolean;

    /**
     * Accepts error handler
     * @param {*} handler
     * @return
     * @return {boolean}
     */
    onError(handler : (p1: OUChatOperationResult) => void) : boolean;

    /**
     * Connection event handler
     * @param {*} handler
     * @return
     * @return {boolean}
     */
    onConnected(handler : (p1: any) => void) : boolean;
}


