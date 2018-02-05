/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * Operation execution result
     * @author yveretelnikov
     * @class
     */
    export class OUChatOperationResult {
        /**
         * Error code or 0
         */
        public errorCode : number;

        /**
         * Error description or null
         */
        public errorDescription : string;

        constructor() {
            if(this.errorCode===undefined) this.errorCode = 0;
            if(this.errorDescription===undefined) this.errorDescription = null;
        }
    }
    OUChatOperationResult["__class"] = "org.wolna.ouchat.OUChatOperationResult";

}

