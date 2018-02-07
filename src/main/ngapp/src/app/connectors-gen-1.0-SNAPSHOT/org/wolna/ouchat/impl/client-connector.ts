import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Parcel } from '../Parcel';
import { OUChatClientConnector } from '../OUChatClientConnector';
import { OUChatOperationResult } from '../OUChatOperationResult';

type USER_ID = string;


/**
 * Client connector
 */
export class OUChatClientConnectorImpl implements OUChatClientConnector {
    
    /**
     * Requests history from server
     * @param lastSeen 
     */
    loadHistory(lastSeen: number): number {
        if(this.isConnected()) {
            var p = new Parcel();
            
            this.stompClient.send("/app/client.histo", {}, JSON.stringify(null));
            return this.operationId++;
        } 
        return -1;
    }
    
    /**
     * Set up connection
     * @param login User login. Use ENTERPRISE KEY for client, or email for operator/supervisor
     * @param passcode user password. Use ENTERPRISE KEY for client, or password for operator/supervisor
     * @param uri endpoint uri
     * @param clientDesc client description
     */
    public connect(login: string, passcode: string, uri: string, clientDesc: Parcel.UserDescription) : boolean {
        this.disconnect(); // ignore return
        
        // Recreate socket
        this.socket = new SockJS(uri);
        this.stompClient = Stomp.over(this.socket);

        // Open socket again
        this.stompClient.connect(login, passcode, 
            () => {
                // subscribe
                this.subscription = this.stompClient.subscribe('/user/queue/client', (payload) => this.onStompReceived(payload));
                if(this.subscription) {                
                    this.stompClient.send("/app/client.hello", {}, 
                        JSON.stringify(
                            new Parcel.ClientHello(clientDesc)
                        )
                    );
                } // in case of error an error frame will arrive from server
                this._onConnected.next(); // signal caller we succeeded
            },
            () => { // error 
                this.disconnect(); // ignore returns
                var res = new OUChatOperationResult();
                res.errorCode = OUChatOperationResult.GENERIC_ERROR;
                res.errorDescription = "Unknown error";
                this._onError.next(res);
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
            var err = new OUChatOperationResult();
            err.errorCode = OUChatOperationResult.ERROR_DISCONNETED;
            err.errorDescription = "Disconnected by user";
            this._onError.next(err);
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

    /**
     * When message arrives
     * @param payload message
     */
    protected onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        // this.onMessage.next(message);
        var res = new OUChatOperationResult();
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
    public onResult(handler : (p1: OUChatOperationResult) => void) : boolean {
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
        //  this._onConnected.unsubscribe();
        this._onConnected.subscribe(handler);
        return true;
    }

     /**
         * Accepts error handler
         * @param {*} handler
         * @return
         * @return {boolean}
         */
    public onError(handler : (p1: OUChatOperationResult) => void) : boolean {
        // this._onError.unsubscribe();
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
    protected _onMessage = new Subject<OUChatOperationResult>();
    /**
     * Communication error
     */
    protected _onError = new Subject<OUChatOperationResult>();

    // Operation part    
    protected operationId: number = 1;
}