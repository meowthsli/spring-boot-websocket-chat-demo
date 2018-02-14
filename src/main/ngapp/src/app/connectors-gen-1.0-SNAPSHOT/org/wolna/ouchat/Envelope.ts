/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
/**
 * Envelope for transport messages
 * @author yveretelnikov
 * @class
 */
export class Envelope {
    public clientHello : Envelope.ClientHello;

    public messageToServer : Envelope.MessageToServer;

    public messageAccepted : Envelope.MessageAccepted;

    public clientHelloOk : Envelope.ClientHelloOk;

    constructor() {
        if(this.clientHello===undefined) this.clientHello = null;
        if(this.messageToServer===undefined) this.messageToServer = null;
        if(this.messageAccepted===undefined) this.messageAccepted = null;
        if(this.clientHelloOk===undefined) this.clientHelloOk = null;
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
    export class ClientHelloOk {
        public id : number;

        constructor() {
            if(this.id===undefined) this.id = 0;
        }
    }
    ClientHelloOk["__class"] = "org.wolna.ouchat.Envelope.ClientHelloOk";


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



