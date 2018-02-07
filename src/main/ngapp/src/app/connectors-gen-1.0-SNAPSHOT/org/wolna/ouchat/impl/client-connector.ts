import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

type USER_ID = string;

/**
 * Client connector
 */
export class OUChatClientConnectorImpl implements org.wolna.ouchat.OUChatClientConnector {
    
    /**
     * Requests history from server
     * @param lastSeen 
     */
    loadHistory(lastSeen: number): number {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Set up connection
     * @param login User login. Use ENTERPRISE KEY for client, or email for operator/supervisor
     * @param passcode user password. Use ENTERPRISE KEY for client, or password for operator/supervisor
     * @param uri endpoint uri
     * @param clientDesc client description
     */
    public connect(login: string, passcode: string, uri: string/*, clientDesc: UserDesc*/) : boolean {
        this.disconnect(); // ignore return
        
        // Recreate socket
        this.socket = new SockJS(uri);
        this.stompClient = Stomp.over(this.socket);

        // Open socket again
        this.stompClient.connect(login, passcode, 
            () => {
                // subscribe
                // this.onConnected.next();

                // this._initialConnect(clientDesc); 
            },
            () => { // error 
                // TODO: event;
                this.disconnect();
                // this.onError.next("Error while communication");
            }
        );
        return true;
    }

    /**
     * Close and disconnect connection, raise event
     */
    public disconnect() : boolean {
        if(this.socket) { 
            if(this.subscription) {
                this.subscription.unsubscribe();
            }
            this.socket.close();
            this.subscription = null;
            this.stompClient = null;
            this.socket = null;
            var err = new org.wolna.ouchat.OUChatOperationResult();
            err.errorCode = org.wolna.ouchat.OUChatOperationResult.ERROR_DISCONNETED;
            err.errorDescription = "Disconnected by user";
            this._onError.next(err);
            return true;
        }
        return false;
    }

    /**
     * Ask server for history. clientID is ignored
     */
    public requestHistory(clientID: USER_ID) : boolean {
        if(this.isConnected()) {
            // this.stompClient.send("/app/client.histo", {}, JSON.stringify(new Parcel2().setRequestHistory(new RequestHistoryCli())));
            return true;
        } 
        return false;
    }

    /**
     * Send message to server. clientID is ignored
     * @param text 
     */
    public say(text: string) : number {
        if(this.isConnected()) {
            // this.stompClient.send("/app/client.say", {}, JSON.stringify(new Parcel2().setSay(new Say(cid, text))));
            
        } else {
            // this.onError.next();
            return 0;
        }       
    }

    /*protected _initialConnect(clientDesc: UserDesc) {
        this.subscription = this.stompClient.subscribe('/user/queue/client', (payload) => this.onStompReceived(payload));
        this.stompClient.send("/app/client.hello", {}, JSON.stringify(new Parcel2().setHelloClient(new HelloClient(clientDesc))));
    }*/

    /**
     * When message arrives
     * @param payload message
     */
    protected onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        // this.onMessage.next(message);
        var res = new org.wolna.ouchat.OUChatOperationResult();
        res.errorCode = 0;
        res.operationId = payload.operationId;
        res.resultMessage = payload.body;
        this._onMessage.next()
    }

    public isConnected() : boolean {
        return this.subscription;
    }

   
    /**
     * Subscribe to messages
     * @param handler 
     */
    public onResult(handler : (p1: org.wolna.ouchat.OUChatOperationResult) => void) : boolean {
        /*if(this._onResultSubscription) {
            this._onResultSubscription.unsubscribe();
            this._onResultSubscription = null;
        }*/

        this._onMessage.unsubscribe();
        /*this._onResultSubscription = */this._onMessage.subscribe(x => handler(x));
        return true;
    }

    /**
         * Connection event handler
         * @param {*} handler
         * @return
         * @return {boolean}
         */
    public onConnected(handler : (p1: any) => void) : boolean {
        this._onConnected.unsubscribe();
        this._onConnected.subscribe(handler);
        return true;
    }

     /**
         * Accepts error handler
         * @param {*} handler
         * @return
         * @return {boolean}
         */
    public onError(handler : (p1: org.wolna.ouchat.OUChatOperationResult) => void) : boolean {
        this._onError.unsubscribe();
        this._onError.subscribe(handler);
        return true;
    }
    
    // Socket part
    protected subscription;
    protected socket;
    protected stompClient;

    
    // Event part
    // protected _onResultSubscription: Subscription;

     /**
     * When connected
     */
    protected _onConnected = new Subject<void>();
    /**
     * Incoming message
     */
    protected _onMessage = new Subject<org.wolna.ouchat.OUChatOperationResult>();
    /**
     * Communication error
     */
    protected _onError = new Subject<org.wolna.ouchat.OUChatOperationResult>();

    // Operation part    
}