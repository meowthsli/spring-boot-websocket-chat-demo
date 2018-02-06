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
            constructor() {
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


        export class MessageDelivered {
            public operationId : number;

            constructor() {
                if(this.operationId===undefined) this.operationId = 0;
            }
        }
        MessageDelivered["__class"] = "org.wolna.ouchat.Parcel.MessageDelivered";

    }

}

