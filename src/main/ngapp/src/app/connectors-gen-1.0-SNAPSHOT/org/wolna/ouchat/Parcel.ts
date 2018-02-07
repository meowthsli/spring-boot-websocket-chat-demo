/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * Envelope for transport messages
     * @author yveretelnikov
     * @class
     */
    export class Parcel {    }
    Parcel["__class"] = "org.wolna.ouchat.Parcel";


    export namespace Parcel {

        export class ClientHello {
            public desc : Parcel.UserDescription;

            constructor() {
                if(this.desc===undefined) this.desc = null;
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


        export class UserDescription {
            public description : string;

            public userId : string;

            public constructor(userId : string, desc : string) {
                if(this.description===undefined) this.description = null;
                if(this.userId===undefined) this.userId = null;
                this.description = desc;
                this.userId = userId;
            }
        }
        UserDescription["__class"] = "org.wolna.ouchat.Parcel.UserDescription";

    }

}

