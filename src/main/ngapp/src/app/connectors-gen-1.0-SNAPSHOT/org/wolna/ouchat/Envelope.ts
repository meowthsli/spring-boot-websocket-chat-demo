/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
/**
 * Envelope for transport messages
 * @author yveretelnikov
 * @class
 */
export class Envelope {
    public messageAccepted : Envelope.MessageAccepted;

    public helloOk : Envelope.HelloOk;

    public loadHistoryResp : Envelope.LoadHistoryResp;

    public tryLockChat : Envelope.OkTryLockChat;

    public releaseChat : Envelope.OkReleaseChat;

    public clientMessage : Envelope.MessageFromClient;

    public opHello : Envelope.OpHello;

    public info : Envelope.Info;

    constructor() {
        if(this.messageAccepted===undefined) this.messageAccepted = null;
        if(this.helloOk===undefined) this.helloOk = null;
        if(this.loadHistoryResp===undefined) this.loadHistoryResp = null;
        if(this.tryLockChat===undefined) this.tryLockChat = null;
        if(this.releaseChat===undefined) this.releaseChat = null;
        if(this.clientMessage===undefined) this.clientMessage = null;
        if(this.opHello===undefined) this.opHello = null;
        if(this.info===undefined) this.info = null;
    }
}
Envelope["__class"] = "org.wolna.ouchat.Envelope";


export namespace Envelope {

    /**
     * Client sends when makes connection
     * @param {Envelope.UserDescription} desc
     * @class
     */
    export class ClientHello {
        public desc : Envelope.UserDescription;

        public constructor(desc? : any) {
            if(((desc != null && desc instanceof <any>Envelope.UserDescription) || desc === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.desc===undefined) this.desc = null;
                if(this.desc===undefined) this.desc = null;
                (() => {
                    if(desc == null) {
                        throw Object.defineProperty(new Error("desc cannot be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.desc = desc;
                })();
            } else if(desc === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.desc===undefined) this.desc = null;
                if(this.desc===undefined) this.desc = null;
            } else throw new Error('invalid overload');
        }
    }
    ClientHello["__class"] = "org.wolna.ouchat.Envelope.ClientHello";


    /**
     * Response from server to client hello
     * @class
     */
    export class HelloOk {
        public ok : number = 1;

        constructor() {
        }
    }
    HelloOk["__class"] = "org.wolna.ouchat.Envelope.HelloOk";


    /**
     * Message sent to server with temp id
     * @param {string} text
     * @param {number} temporaryId
     * @class
     */
    export class MessageToServer {
        public text : string;

        public temporaryId : number;

        public constructor(text? : any, temporaryId? : any) {
            if(((typeof text === 'string') || text === null) && ((typeof temporaryId === 'number') || temporaryId === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                (() => {
                    if(text == null) {
                        throw Object.defineProperty(new Error("text cannot be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.text = text;
                    this.temporaryId = temporaryId;
                })();
            } else if(text === undefined && temporaryId === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
            } else throw new Error('invalid overload');
        }
    }
    MessageToServer["__class"] = "org.wolna.ouchat.Envelope.MessageToServer";


    /**
     * Message delivering confirmation. Has to be sent from server to client
     * @param {number} messageTemporaryId
     * @param {number} messageId
     * @param {Date} when
     * @class
     */
    export class MessageAccepted {
        public messageId : number;

        public messageTemporaryId : number;

        public when : Date;

        public constructor(messageTemporaryId : number, messageId : number, when : Date) {
            if(this.messageId===undefined) this.messageId = 0;
            if(this.messageTemporaryId===undefined) this.messageTemporaryId = 0;
            if(this.when===undefined) this.when = null;
            this.messageTemporaryId = messageTemporaryId;
            this.messageId = messageId;
            this.when = when;
        }
    }
    MessageAccepted["__class"] = "org.wolna.ouchat.Envelope.MessageAccepted";


    export class OpHello {
        public desc : Envelope.UserDescription;

        public constructor(desc? : any) {
            if(((desc != null && desc instanceof <any>Envelope.UserDescription) || desc === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.desc===undefined) this.desc = null;
                if(this.desc===undefined) this.desc = null;
                (() => {
                    if(desc == null) {
                        throw Object.defineProperty(new Error("desc cannot be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.desc = desc;
                })();
            } else if(desc === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.desc===undefined) this.desc = null;
                if(this.desc===undefined) this.desc = null;
            } else throw new Error('invalid overload');
        }
    }
    OpHello["__class"] = "org.wolna.ouchat.Envelope.OpHello";


    /**
     * Message sent to server with temp id and client target
     * @param {string} clientID
     * @param {string} text
     * @param {number} temporaryId
     * @class
     */
    export class MessageToServerOp {
        public text : string;

        public temporaryId : number;

        public clientID : string;

        public constructor(clientID? : any, text? : any, temporaryId? : any) {
            if(((typeof clientID === 'string') || clientID === null) && ((typeof text === 'string') || text === null) && ((typeof temporaryId === 'number') || temporaryId === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                if(this.clientID===undefined) this.clientID = null;
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    if(text == null) {
                        throw Object.defineProperty(new Error("@text cannot be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    if(clientID == null) {
                        throw Object.defineProperty(new Error("@clientID cannot be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.text = text;
                    this.temporaryId = temporaryId;
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined && text === undefined && temporaryId === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                if(this.clientID===undefined) this.clientID = null;
                if(this.text===undefined) this.text = null;
                if(this.temporaryId===undefined) this.temporaryId = 0;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    MessageToServerOp["__class"] = "org.wolna.ouchat.Envelope.MessageToServerOp";


    /**
     * User description
     * @param {string} userLogin
     * @param {string} fio
     * @param {Array} tags
     * @class
     */
    export class UserDescription {
        public fio : string;

        public userLogin : string;

        public tags : string[];

        public constructor(userLogin? : any, fio? : any, tags? : any) {
            if(((typeof userLogin === 'string') || userLogin === null) && ((typeof fio === 'string') || fio === null) && ((tags != null && tags instanceof <any>Array && (tags.length==0 || tags[0] == null ||(typeof tags[0] === 'string'))) || tags === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.fio===undefined) this.fio = null;
                if(this.userLogin===undefined) this.userLogin = null;
                if(this.tags===undefined) this.tags = null;
                if(this.fio===undefined) this.fio = null;
                if(this.userLogin===undefined) this.userLogin = null;
                if(this.tags===undefined) this.tags = null;
                (() => {
                    if(tags == null) {
                        tags = [];
                    }
                    this.fio = fio;
                    this.userLogin = userLogin;
                    this.tags = tags;
                })();
            } else if(userLogin === undefined && fio === undefined && tags === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.fio===undefined) this.fio = null;
                if(this.userLogin===undefined) this.userLogin = null;
                if(this.tags===undefined) this.tags = null;
                if(this.fio===undefined) this.fio = null;
                if(this.userLogin===undefined) this.userLogin = null;
                if(this.tags===undefined) this.tags = null;
            } else throw new Error('invalid overload');
        }
    }
    UserDescription["__class"] = "org.wolna.ouchat.Envelope.UserDescription";


    /**
     * Message to load client history from server
     * @param {number} lastSeenMessage
     * @class
     */
    export class LoadHistory {
        public lastSeenMessage : number;

        public constructor(lastSeenMessage? : any) {
            if(((typeof lastSeenMessage === 'number') || lastSeenMessage === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                (() => {
                    this.lastSeenMessage = lastSeenMessage;
                })();
            } else if(lastSeenMessage === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
            } else throw new Error('invalid overload');
        }
    }
    LoadHistory["__class"] = "org.wolna.ouchat.Envelope.LoadHistory";


    /**
     * Message to load client history from server
     * @param {string} clientLogin
     * @param {number} lastSeenMessage
     * @class
     */
    export class LoadHistoryOp {
        public lastSeenMessage : number;

        public clientLogin : string;

        public constructor(clientLogin? : any, lastSeenMessage? : any) {
            if(((typeof clientLogin === 'string') || clientLogin === null) && ((typeof lastSeenMessage === 'number') || lastSeenMessage === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientLogin===undefined) this.clientLogin = null;
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientLogin===undefined) this.clientLogin = null;
                (() => {
                    this.lastSeenMessage = lastSeenMessage;
                    this.clientLogin = clientLogin;
                })();
            } else if(clientLogin === undefined && lastSeenMessage === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientLogin===undefined) this.clientLogin = null;
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientLogin===undefined) this.clientLogin = null;
            } else throw new Error('invalid overload');
        }
    }
    LoadHistoryOp["__class"] = "org.wolna.ouchat.Envelope.LoadHistoryOp";


    /**
     * History messages
     * @param {Array} messages
     * @param {string} userLogin
     * @class
     */
    export class LoadHistoryResp {
        public messages : Envelope.TextMessage[];

        public userLogin : string;

        public constructor(messages : Envelope.TextMessage[], userLogin : string) {
            if(this.messages===undefined) this.messages = null;
            if(this.userLogin===undefined) this.userLogin = null;
            this.messages = messages;
            this.userLogin = userLogin;
        }
    }
    LoadHistoryResp["__class"] = "org.wolna.ouchat.Envelope.LoadHistoryResp";


    /**
     * Message to load client history from server
     * @param {string} clientID
     * @param {Envelope.TextMessage} message
     * @class
     */
    export class MessageFromClient {
        public message : Envelope.TextMessage;

        public clientID : string;

        public constructor(clientID? : any, message? : any) {
            if(((typeof clientID === 'string') || clientID === null) && ((message != null && message instanceof <any>Envelope.TextMessage) || message === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.message===undefined) this.message = null;
                if(this.clientID===undefined) this.clientID = null;
                if(this.message===undefined) this.message = null;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    this.message = message;
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined && message === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.message===undefined) this.message = null;
                if(this.clientID===undefined) this.clientID = null;
                if(this.message===undefined) this.message = null;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    MessageFromClient["__class"] = "org.wolna.ouchat.Envelope.MessageFromClient";


    export class TryLockChat {
        public clientID : string;

        public constructor(clientID? : any) {
            if(((typeof clientID === 'string') || clientID === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    if(clientID == null) {
                        throw Object.defineProperty(new Error("@clientID can not be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    TryLockChat["__class"] = "org.wolna.ouchat.Envelope.TryLockChat";


    export class OkTryLockChat {
        public clientID : string;

        public constructor(clientID? : any) {
            if(((typeof clientID === 'string') || clientID === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    if(clientID == null) {
                        throw Object.defineProperty(new Error("@clientID can not be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    OkTryLockChat["__class"] = "org.wolna.ouchat.Envelope.OkTryLockChat";


    export class ReleaseChat {
        public clientID : string;

        public constructor(clientID? : any) {
            if(((typeof clientID === 'string') || clientID === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    if(clientID == null) {
                        throw Object.defineProperty(new Error("@clientID can not be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    ReleaseChat["__class"] = "org.wolna.ouchat.Envelope.ReleaseChat";


    export class OkReleaseChat {
        public clientID : string;

        public constructor(clientID? : any) {
            if(((typeof clientID === 'string') || clientID === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    if(clientID == null) {
                        throw Object.defineProperty(new Error("@clientID can not be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    OkReleaseChat["__class"] = "org.wolna.ouchat.Envelope.OkReleaseChat";


    export class InfoRequest {
        public clientID : string;

        public constructor(clientID? : any) {
            if(((typeof clientID === 'string') || clientID === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    InfoRequest["__class"] = "org.wolna.ouchat.Envelope.InfoRequest";


    export class Info {
        public description : Envelope.UserDescription;

        public constructor(desc? : any) {
            if(((desc != null && desc instanceof <any>Envelope.UserDescription) || desc === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.description===undefined) this.description = null;
                if(this.description===undefined) this.description = null;
                (() => {
                    this.description = desc;
                })();
            } else if(desc === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.description===undefined) this.description = null;
                if(this.description===undefined) this.description = null;
            } else throw new Error('invalid overload');
        }
    }
    Info["__class"] = "org.wolna.ouchat.Envelope.Info";


    export class Response extends Envelope {
        /**
         * Error code. 0 for success
         */
        public errorCode : number = 0;

        /**
         * When connection is not established
         */
        public static ERROR_NOT_CONNECTED : number = 1;

        /**
         * When operation in not valid
         */
        public static ERROR_INVALID_OPERATION : number = 2;

        /**
         * When disconnected
         */
        public static ERROR_DISCONNECTED : number = 3;

        /**
         * When command cant be ran due to wrong state
         */
        public static ERROR_WRONG_STATE : number = 4;

        /**
         * Unknown error
         */
        public static GENERIC_ERROR : number = 1000;

        /**
         * Error description or null
         */
        public errorDescription : string;

        constructor() {
            super();
            if(this.errorDescription===undefined) this.errorDescription = null;
        }
    }
    Response["__class"] = "org.wolna.ouchat.Envelope.Response";


    export class TextMessage {
        public id : number;

        public text : string;

        public fromClient : boolean;

        public dateAt : Date;

        public constructor(id? : any, text? : any, fromClient? : any, createdAt? : any) {
            if(((typeof id === 'number') || id === null) && ((typeof text === 'string') || text === null) && ((typeof fromClient === 'boolean') || fromClient === null) && ((createdAt != null && createdAt instanceof <any>Date) || createdAt === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.id===undefined) this.id = 0;
                if(this.text===undefined) this.text = null;
                if(this.fromClient===undefined) this.fromClient = false;
                if(this.dateAt===undefined) this.dateAt = null;
                if(this.id===undefined) this.id = 0;
                if(this.text===undefined) this.text = null;
                if(this.fromClient===undefined) this.fromClient = false;
                if(this.dateAt===undefined) this.dateAt = null;
                (() => {
                    this.id = id;
                    this.text = text;
                    this.fromClient = fromClient;
                    this.dateAt = createdAt;
                })();
            } else if(id === undefined && text === undefined && fromClient === undefined && createdAt === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.id===undefined) this.id = 0;
                if(this.text===undefined) this.text = null;
                if(this.fromClient===undefined) this.fromClient = false;
                if(this.dateAt===undefined) this.dateAt = null;
                if(this.id===undefined) this.id = 0;
                if(this.text===undefined) this.text = null;
                if(this.fromClient===undefined) this.fromClient = false;
                if(this.dateAt===undefined) this.dateAt = null;
            } else throw new Error('invalid overload');
        }
    }
    TextMessage["__class"] = "org.wolna.ouchat.Envelope.TextMessage";

}



