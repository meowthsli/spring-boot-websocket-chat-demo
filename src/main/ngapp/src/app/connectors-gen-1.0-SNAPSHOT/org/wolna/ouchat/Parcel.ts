/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
/**
 * Envelope for transport messages
 * @author yveretelnikov
 * @class
 */
export class Parcel {}
Parcel["__class"] = "org.wolna.ouchat.Parcel";


export namespace Parcel {

    /**
     * Client sends when makes connection
     * @param {Parcel.UserDescription} desc
     * @class
     */
    export class ClientHello {
        public desc : Parcel.UserDescription;

        public constructor(desc : Parcel.UserDescription) {
            if(this.desc===undefined) this.desc = null;
            if(desc == null) {
                throw Object.defineProperty(new Error("desc cannot be null"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
            }
            this.desc = desc;
        }
    }
    ClientHello["__class"] = "org.wolna.ouchat.Parcel.ClientHello";


    export class ClientConnected {
        public clientID : string;

        constructor() {
            if(this.clientID===undefined) this.clientID = null;
        }
    }
    ClientConnected["__class"] = "org.wolna.ouchat.Parcel.ClientConnected";


    /**
     * Message delivering confirmation. Has to be sent from server to client
     * @param {number} operationId
     * @param {number} messageId
     * @class
     */
    export class MessageDelivered {
        public operationId : number;

        public messageId : number;

        public constructor(operationId : number, messageId : number) {
            if(this.operationId===undefined) this.operationId = 0;
            if(this.messageId===undefined) this.messageId = 0;
            this.operationId = operationId;
            this.messageId = messageId;
        }
    }
    MessageDelivered["__class"] = "org.wolna.ouchat.Parcel.MessageDelivered";


    /**
     * 
     * @param {number} lastSeenId id of last message seen
     * @class
     */
    export class HistoryRequest {
        public lastSeenId : number;

        public constructor(lastSeenId : number) {
            if(this.lastSeenId===undefined) this.lastSeenId = 0;
            this.lastSeenId = lastSeenId;
        }
    }
    HistoryRequest["__class"] = "org.wolna.ouchat.Parcel.HistoryRequest";


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

        public constructor(userLogin : string, fio : string, tags : string[]) {
            if(this.fio===undefined) this.fio = null;
            if(this.userLogin===undefined) this.userLogin = null;
            if(this.tags===undefined) this.tags = null;
            if(tags == null) {
                tags = [];
            }
            this.fio = fio;
            this.userLogin = userLogin;
            this.tags = tags;
        }
    }
    UserDescription["__class"] = "org.wolna.ouchat.Parcel.UserDescription";

}



