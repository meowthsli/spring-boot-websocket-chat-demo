import * as Stomp from 'stompjs';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { OUChatClientConnector } from '../OUChatClientConnector';
import { Envelope } from '../Envelope';

type USER_ID = string;


/**
 * Client connector
 */
export class OUChatClientConnectorImpl implements OUChatClientConnector {

    /**
     * Set up connection
     * @param login User login. Use ENTERPRISE KEY for client, or email for operator/supervisor
     * @param passcode user password. Use ENTERPRISE KEY for client, or password for operator/supervisor
     * @param uri endpoint uri
     * @param clientDesc client description
     */
    public connect(uri: string, key: string, clientDesc: Envelope.UserDescription) : boolean {
        this.disconnect(); // ignore return
        
        // Recreate socket
        // this.socket = new SockJS(uri);
        this.stompClient = Stomp.client(uri + "?api_key=" + key + "&login=" + clientDesc.userLogin);

        // Open socket again
        this.stompClient.connect(".", ".", 
            () => {
                // subscribe
                this.subscription = this.stompClient.subscribe('/user/queue/client', (payload) => this.onStompReceived(payload));
                if(this.subscription) { 
                    this.stompClient.send("/app/client.hello", {}, JSON.stringify(new Envelope.ClientHello(clientDesc)));
                } // in case of error an error frame will arrive from server
                this._onConnected.next(); // signal caller we succeeded
            },
            () => { // error 
                // this.disconnect(); // ignore returns
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
        if(this.subscription) {
            this.subscription.unsubscribe();        
            this.subscription = null;
            this.stompClient = null;
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
    public loadHistory(lastSeen: number): number {
        if(this.isConnected()) {
            var p = new Envelope();
            
            this.stompClient.send("/app/client.histo", {}, JSON.stringify(new Envelope.LoadHistory(lastSeen)));
            return Envelope.Response.ERROR_NOT_CONNECTED;
        } 
        return Envelope.Response.GENERIC_ERROR;
    }

    /**
     * Send message to server. clientID is ignored
     * @param text 
     */
    public say(text: string) : number {
        if(!this.isConnected()) {
            var env = new Envelope.Response();
            env.errorCode = Envelope.Response.ERROR_NOT_CONNECTED;
            env.errorDescription = "Not connected";
            this._onError.next(env);
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }   
        this.stompClient.send("/app/client.say", {}, JSON.stringify(new Envelope.MessageToServer(text, ++this.messageTempId)));
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
        // this._onMessage.unsubscribe();
        /*this._onResultSubscription = */this._onMessage.subscribe(x => handler(x));
        return true;
    }

    /**
     * Subscribe to connection
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
    public onError(handler : (p1: Envelope.Response) => void) : boolean {
        // this._onError.unsubscribe();
        this._onError.subscribe(handler);
        return true;
    }
    
    // Socket part
    protected subscription;
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