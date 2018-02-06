/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * Operation execution result
     * @author yveretelnikov
     * @class
     */
    export class OUChatOperationResult {
        /**
         * Id of operation. Must not be null
         */
        public operationId : number;

        /**
         * Message (if any)
         */
        public resultMessage : org.wolna.ouchat.Parcel;

        /**
         * Error code or 0
         */
        public errorCode : number;

        /**
         * Error description or null
         */
        public errorDescription : string;

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
        public static ERROR_DISCONNETED : number = 3;

        /**
         * Unknown error
         */
        public static GENERIC_ERROR : number = 1000;

        constructor() {
            if(this.operationId===undefined) this.operationId = 0;
            if(this.resultMessage===undefined) this.resultMessage = null;
            if(this.errorCode===undefined) this.errorCode = 0;
            if(this.errorDescription===undefined) this.errorDescription = null;
        }
    }
    OUChatOperationResult["__class"] = "org.wolna.ouchat.OUChatOperationResult";

}

