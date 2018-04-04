/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
/**
 * Envelope for transport messages
 * @author yveretelnikov
 * @class
 */
export class Envelope {
    public messageAccepted : Envelope.MessageAccepted;

    public helloOk : Envelope.HelloOk;

    public messages : Envelope.MessagesArrived;

    public tryLockChat : Envelope.OkTryLockChat;

    public releaseChat : Envelope.OkReleaseChat;

    public opHello : Envelope.OpHello;

    public info : Envelope.Info;

    public fileContent : Envelope.FileContent;

    public fileMessageAccepted : Envelope.FileMessageAccepted;

    constructor() {
        if(this.messageAccepted===undefined) this.messageAccepted = null;
        if(this.helloOk===undefined) this.helloOk = null;
        if(this.messages===undefined) this.messages = null;
        if(this.tryLockChat===undefined) this.tryLockChat = null;
        if(this.releaseChat===undefined) this.releaseChat = null;
        if(this.opHello===undefined) this.opHello = null;
        if(this.info===undefined) this.info = null;
        if(this.fileContent===undefined) this.fileContent = null;
        if(this.fileMessageAccepted===undefined) this.fileMessageAccepted = null;
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
     * @param {Array} fileMessages
     * @param {string} userLogin
     * @class
     */
    export class MessagesArrived {
        public messages : Envelope.TextMessage[];

        public fileMessages : Envelope.FileTextMessage[];

        public userLogin : string;

        public constructor(messages : Envelope.TextMessage[], fileMessages : Envelope.FileTextMessage[], userLogin : string) {
            if(this.messages===undefined) this.messages = null;
            if(this.fileMessages===undefined) this.fileMessages = null;
            if(this.userLogin===undefined) this.userLogin = null;
            this.messages = messages;
            this.userLogin = userLogin;
            this.fileMessages = fileMessages;
        }
    }
    MessagesArrived["__class"] = "org.wolna.ouchat.Envelope.MessagesArrived";


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

        public opID : string;

        public constructor(clientID? : any, opID? : any) {
            if(((typeof clientID === 'string') || clientID === null) && ((typeof opID === 'string') || opID === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.opID===undefined) this.opID = null;
                if(this.clientID===undefined) this.clientID = null;
                if(this.opID===undefined) this.opID = null;
                (() => {
                    if(clientID == null) {
                        throw Object.defineProperty(new Error("@clientID can not be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    if(opID == null) {
                        throw Object.defineProperty(new Error("@opID can not be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
                    }
                    this.clientID = clientID;
                    this.opID = opID;
                })();
            } else if(clientID === undefined && opID === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.clientID===undefined) this.clientID = null;
                if(this.opID===undefined) this.opID = null;
                if(this.clientID===undefined) this.clientID = null;
                if(this.opID===undefined) this.opID = null;
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


    export class RequestFileContent {
        public contentReference : string;

        public constructor(contentReference? : any) {
            if(((typeof contentReference === 'string') || contentReference === null)) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.contentReference===undefined) this.contentReference = null;
                if(this.contentReference===undefined) this.contentReference = null;
                (() => {
                    this.contentReference = contentReference;
                })();
            } else if(contentReference === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                if(this.contentReference===undefined) this.contentReference = null;
                if(this.contentReference===undefined) this.contentReference = null;
            } else throw new Error('invalid overload');
        }
    }
    RequestFileContent["__class"] = "org.wolna.ouchat.Envelope.RequestFileContent";


    export class FileMessageToServer extends Envelope.MessageToServer {
        public content : string;

        public filename : string;

        public constructor(temporaryId? : any, content? : any, filename? : any) {
            if(((typeof temporaryId === 'number') || temporaryId === null) && ((typeof content === 'string') || content === null) && ((typeof filename === 'string') || filename === null)) {
                let __args = Array.prototype.slice.call(arguments);
                super("", temporaryId);
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                (() => {
                    this.content = content;
                    this.filename = filename;
                })();
            } else if(temporaryId === undefined && content === undefined && filename === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                super();
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
            } else throw new Error('invalid overload');
        }
    }
    FileMessageToServer["__class"] = "org.wolna.ouchat.Envelope.FileMessageToServer";


    export class FileMessageAccepted extends Envelope.MessageAccepted {
        public contentReference : string;

        public constructor(reference : string, messageTemporaryId : number, messageId : number, when : Date) {
            super(messageTemporaryId, messageId, when);
            if(this.contentReference===undefined) this.contentReference = null;
            this.contentReference = reference;
        }
    }
    FileMessageAccepted["__class"] = "org.wolna.ouchat.Envelope.FileMessageAccepted";


    export class FileMessageToServerOp extends Envelope.MessageToServerOp {
        public content : string;

        public filename : string;

        public constructor(clientID? : any, temporaryId? : any, content? : any, filename? : any) {
            if(((typeof clientID === 'string') || clientID === null) && ((typeof temporaryId === 'number') || temporaryId === null) && ((typeof content === 'string') || content === null) && ((typeof filename === 'string') || filename === null)) {
                let __args = Array.prototype.slice.call(arguments);
                super(clientID, "", temporaryId);
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                (() => {
                    this.content = content;
                    this.filename = filename;
                })();
            } else if(clientID === undefined && temporaryId === undefined && content === undefined && filename === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                super();
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
            } else throw new Error('invalid overload');
        }
    }
    FileMessageToServerOp["__class"] = "org.wolna.ouchat.Envelope.FileMessageToServerOp";


    export class FileTextMessage extends Envelope.TextMessage {
        public contentReference : string;

        public constructor(id : number, fromClient : boolean, fileName : string, createdAt : Date, contentReference : string) {
            super(id, fileName, fromClient, createdAt);
            if(this.contentReference===undefined) this.contentReference = null;
            this.contentReference = contentReference;
        }
    }
    FileTextMessage["__class"] = "org.wolna.ouchat.Envelope.FileTextMessage";


    export class FileContent extends Envelope.RequestFileContent {
        public content : string;

        public filename : string;

        public constructor(reference? : any, fileName? : any, content? : any) {
            if(((typeof reference === 'string') || reference === null) && ((typeof fileName === 'string') || fileName === null) && ((typeof content === 'string') || content === null)) {
                let __args = Array.prototype.slice.call(arguments);
                super(reference);
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                (() => {
                    this.filename = fileName;
                    this.content = content;
                })();
            } else if(reference === undefined && fileName === undefined && content === undefined) {
                let __args = Array.prototype.slice.call(arguments);
                super();
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
                if(this.content===undefined) this.content = null;
                if(this.filename===undefined) this.filename = null;
            } else throw new Error('invalid overload');
        }
    }
    FileContent["__class"] = "org.wolna.ouchat.Envelope.FileContent";

}



