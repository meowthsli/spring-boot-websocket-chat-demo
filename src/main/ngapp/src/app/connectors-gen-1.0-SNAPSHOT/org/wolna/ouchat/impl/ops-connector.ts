import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { OUChatClientConnector } from '../OUChatClientConnector';
import { Envelope } from '../Envelope';
import { OUChatOpsConnector } from '../OUChatOpsConnector';

type USER_ID = string;


/**
 * Client connector
 */
export class OUChatOpsConnectorImpl implements OUChatOpsConnector {
    
    tryAcquireChat(clientID: string): number {
        throw new Error("Method not implemented.");
    }
    releaseChat(clientID: string): number {
        throw new Error("Method not implemented.");
    }

    /**
     * Set up connection
     * @param login User login. Use ENTERPRISE KEY for client, or email for operator/supervisor
     * @param passcode user password. Use ENTERPRISE KEY for client, or password for operator/supervisor
     * @param uri endpoint uri
     * @param clientDesc client description
     */
    public connect(login: string, passcode: string, uri: string, clientDesc: Envelope.UserDescription) : boolean {
        this.disconnect(); // ignore return
        
        // Recreate socket
        this.socket = new SockJS(uri);
        this.stompClient = Stomp.over(this.socket);

        // Open socket again
        this.stompClient.connect(login, passcode, 
            () => {
                // subscribe
                
                this.broadcastSubscription = this.stompClient.subscribe('/broadcast/all-ops', (payload) => this.onStompReceived(payload));
                this.subscription = this.stompClient.subscribe('/user/queue/op', (payload) => this.onStompReceived(payload));
                
                if(this.subscription && this.broadcastSubscription) { 
                    this.stompClient.send("/app/op.hello", {}, JSON.stringify(new Envelope.OpHello(clientDesc)));
                } // in case of error an error frame will arrive from server
                this._onConnected.next(); // signal caller we succeeded
            },
            () => { // error 
                this.disconnect(); // ignore returns
                var res = new Envelope.Response();
                res.errorCode = Envelope.Response.GENERIC_ERROR;
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
            if(this.broadcastSubscription) {
                this.broadcastSubscription.unsubscribe();
            };
            this.socket.close();
            this.subscription = null;
            this.stompClient = null;
            this.socket = null;
            var err = new Envelope.Response();
            err.errorCode = Envelope.Response.ERROR_DISCONNECTED;
            err.errorDescription = "Disconnected by user";
            this._onError.next(err);
            return true;
        }
        return false;
    }

    /**
     * Requests history from server
     * @param lastSeen 
     */
    public loadHistory(clientID: string, lastSeen: number): number {
        if(this.isConnected()) {
            var p = new Envelope();
            
            this.stompClient.send("/app/op.histo", {}, JSON.stringify(new Envelope.LoadHistoryOp(clientID, lastSeen)));
            return 0;
        } 
        return Envelope.Response.GENERIC_ERROR;
    }

    /**
     * Send message to server. clientID is ignored
     * @param text 
     */
    public say(clientID: string, text: string) : number {
        if(!this.isConnected()) {
            var env = new Envelope.Response();
            env.errorCode = Envelope.Response.ERROR_NOT_CONNECTED;
            env.errorDescription = "Not connected";
            this._onError.next(env);
            return 0;
        }   
        this.stompClient.send("/app/op.say", {}, JSON.stringify(new Envelope.MessageToServerOp(clientID, text, ++this.messageTempId)));
        return this.messageTempId;
    }

    /**
     * When message arrives
     * @param payload message
     */
    protected onStompReceived(payload) {
        var message = JSON.parse(payload.body); // Envelope
        this._onMessage.next(message)
    }

    public isConnected() : boolean {
        return !(!this.subscription);
    }

   
    /**
     * Subscribe to messages
     * @param handler 
     */
    public onResult(handler : (p1: Envelope.Response) => void) : boolean {      
        this._onMessage.subscribe(x => handler(x));
        return true;
    }

    /**
     * Subscribe to connection
     * @param {*} handler
     * @return
     * @return {boolean}
     */
    public onConnected(handler : (p1: any) => void) : boolean {        
        this._onConnected.subscribe(handler);
        return true;
    }

     /**
         * Accepts error handler
         * @param {*} handler
         * @return
         * @return {boolean}
         */
    public onError(handler : (p1: Envelope.Response) => void) : boolean {
        this._onError.subscribe(handler);
        return true;
    }
    
    // Socket part
    protected subscription;
    protected broadcastSubscription;
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
    protected _onMessage = new Subject<Envelope.Response>();
    /**
     * Communication error
     */
    protected _onError = new Subject<Envelope.Response>();

    // Operation part    
    protected messageTempId: number = 1;
}