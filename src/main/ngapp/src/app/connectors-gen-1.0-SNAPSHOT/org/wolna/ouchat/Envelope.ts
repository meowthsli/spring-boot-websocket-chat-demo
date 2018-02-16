/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
/**
 * Envelope for transport messages
 * @author yveretelnikov
 * @class
 */
export class Envelope {
    public messageToServer : Envelope.MessageToServer;

    public messageAccepted : Envelope.MessageAccepted;

    public clientHelloOk : Envelope.HelloOk;

    public loadClientHistoryResp : Envelope.LoadHistoryResp;

    constructor() {
        if(this.messageToServer===undefined) this.messageToServer = null;
        if(this.messageAccepted===undefined) this.messageAccepted = null;
        if(this.clientHelloOk===undefined) this.clientHelloOk = null;
        if(this.loadClientHistoryResp===undefined) this.loadClientHistoryResp = null;
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
        public id : number = 1;

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
     * History messages
     * @param {Array} messages
     * @class
     */
    export class LoadHistoryResp {
        public messages : string[];

        public constructor(messages : string[]) {
            if(this.messages===undefined) this.messages = null;
            this.messages = messages;
        }
    }
    LoadHistoryResp["__class"] = "org.wolna.ouchat.Envelope.LoadHistoryResp";


    /**
     * Message to load client history from server
     * @param {string} clientID
     * @param {number} lastSeenMessage
     * @class
     */
    export class LoadHistoryOp {
        public lastSeenMessage : number;

        public clientID : string;

        public constructor(clientID? : any, lastSeenMessage? : any) {
            if(((typeof clientID === 'string') || clientID === null) && ((typeof lastSeenMessage === 'number') || lastSeenMessage === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientID===undefined) this.clientID = null;
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientID===undefined) this.clientID = null;
                (() => {
                    this.lastSeenMessage = lastSeenMessage;
                    this.clientID = clientID;
                })();
            } else if(clientID === undefined && lastSeenMessage === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientID===undefined) this.clientID = null;
                if(this.lastSeenMessage===undefined) this.lastSeenMessage = 0;
                if(this.clientID===undefined) this.clientID = null;
            } else throw new Error('invalid overload');
        }
    }
    LoadHistoryOp["__class"] = "org.wolna.ouchat.Envelope.LoadHistoryOp";


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

}



