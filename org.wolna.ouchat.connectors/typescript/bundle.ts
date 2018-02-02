/* Generated from Java with JSweet 2.0.1-SNAPSHOT - http://www.jsweet.org */
namespace org.wolna.ouchat {
    /**
     * 
     * @author yurij
     * @class
     */
    export interface OUChatConnector {
        connect(uri : string, login : string, password : string) : boolean;

        disconnect() : boolean;

        loadHistory();

        say(text : string);
    }
}

