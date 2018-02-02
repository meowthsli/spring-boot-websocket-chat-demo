import { OUChatClientConnector } from "./client-connector";
import { UserDesc, HelloClient, Parcel2, Say, OpSay, RequestHistoryOp, RequestLock } from "./dtos";

type USER_ID = string;

/**
 * Operator connector. Extends client connector
 */
export class OUChatOperatorConnector extends OUChatClientConnector {

    /**
     * Initialize connection
     * @param clientDesc 
     */
    protected _initialConnect(clientDesc: UserDesc) {
        this.broadcastSubscription = this.stompClient.subscribe('/broadcast/all-ops', (payload) => super.onStompReceived(payload));
        this.subscription = this.stompClient.subscribe('/user/queue/op', (payload) => this.onStompReceived(payload));
        
        this.stompClient.send("/app/operator.hello", {}, JSON.stringify(new Parcel2().setHelloClient(new HelloClient(clientDesc))));
    }

    /**
     * Drop connection to server
     */
    public disconnect() : boolean {
        if(this.socket) { 
            if(this.broadcastSubscription) {
                this.broadcastSubscription.unsubscribe();
            }
            this.broadcastSubscription = null;
        }
        return super.disconnect();
    }

    /**
     * Send message to server
     * @param text 
     */
    public say(cid: number, text: string, clientID: USER_ID) {
        if(super.isConnected()) {
            this.stompClient.send("/app/operator.say", {}, JSON.stringify(new Parcel2().setSay(new OpSay(cid, text, clientID))));
            return true;
        } 
        return false;
    }

    /**
     * Load history of given client
     * @param clientID 
     */
    public requestHistory(clientID: USER_ID) : boolean {
        if(this.isConnected()) {
            this.stompClient.send("/app/operator.histo", {}, JSON.stringify(new Parcel2().setHistoryOp(new RequestHistoryOp(clientID))));
            return true;
        }
        return false;
    }

    public tryLock(clientID: USER_ID) {
        if(this.subscription) {
            this.stompClient.send("/app/operator.tryLock", {}, JSON.stringify(new Parcel2().setRequestLock(new RequestLock(clientID))));
            return true;
        }
        return false;
    }

    public release(clientID: USER_ID) {
        if(this.subscription) {
            this.stompClient.send("/app/operator.release", {}, JSON.stringify({clientID: clientID}));
            return true;
        }
        return false;
    }

    /**
     * Load info about clients
     * @param info 
     */
    public getInfo(info: Array<USER_ID>) {
        if(this.subscription) {
            this.stompClient.send("/app/operator.getInfo", {}, JSON.stringify({info: info}));
            return true;
        }
        return false;
    }



    private broadcastSubscription;
}