import * as Stomp from 'stompjs';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Envelope } from '../Envelope';
import { OUChatOpsConnector } from '../OUChatOpsConnector';

type USER_ID = string;


/**
 * Client connector
 */
export class OUChatOpConnectorImpl implements OUChatOpsConnector {

    company: number = 1;

    /**
     * Request file from server
     * @param reference
     */
    requestFile(reference: string): number {
        if(!this.isConnected()) {
            var env = new Envelope.Response();
            env.errorCode = Envelope.Response.ERROR_NOT_CONNECTED;
            env.errorDescription = "Not connected";
            this._onError.next(env);
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }
        this.stompClient.send("/app/op.getfile", {}, JSON.stringify(
            new Envelope.RequestFileContent(reference)
        ));
        return 0;
    }
    /**
     * Send file to server
     * @param content
     * @param name
     */
    sendFile(content: string, name: string): number {
        if(!this.isConnected()) {
            var env = new Envelope.Response();
            env.errorCode = Envelope.Response.ERROR_NOT_CONNECTED;
            env.errorDescription = "Not connected";
            this._onError.next(env);
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }
        this.stompClient.send("/app/op.putfile", {}, JSON.stringify(
            new Envelope.FileMessageToServer(++this.messageTempId, content, name)
        ));
        return this.messageTempId;
    }

    /**
     * Request full client info
     *
     * @param {string} clientID
     */
    public getInfo(clientID: string) {
        if(!this.isConnected()) {
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }
        this.stompClient.send("/app/op.info", {}, JSON.stringify(new Envelope.Info(clientID)));
    }

    /**
     * Try to lock chat to speak
     * @param clientID client
     */
    public tryAcquireChat(clientID: string): number {
        if(!this.isConnected()) {
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }
        this.stompClient.send("/app/op.tryLock", {}, JSON.stringify(new Envelope.TryLockChat(clientID)));
        return 0;
    }

    /**
     * Release locked chat
     * @param clientID client
     */
    public releaseChat(clientID: string): number {
        if(!this.isConnected()) {
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }
        this.stompClient.send("/app/op.release", {}, JSON.stringify(new Envelope.ReleaseChat(clientID)));
        return 0;
    }

    /**
     * Set up connection
     * @param key JWT token for supervisor
     * @param uri endpoint uri
     * @param opDesc operator description. You can not to fill login email for operator/supervisor
     */
    public connect(uri: string, key: string, opDesc: Envelope.UserDescription) : boolean {
        this.disconnect(); // ignore return

        // Recreate client
       this.stompClient = Stomp.client(uri + "?jwt=" + key);

        // Open socket again
        this.stompClient.connect(".", ".",
            () => {
                // subscribe

                this.broadcastSubscription = this.stompClient.subscribe('/broadcast/all-ops' + '/' + this.company, (payload) => this.onStompReceived(payload));
                this.subscription = this.stompClient.subscribe('/user/queue/op', (payload) => this.onStompReceived(payload));

                if(this.subscription && this.broadcastSubscription) {
                    this.stompClient.send("/app/op.hello", {}, JSON.stringify(new Envelope.OpHello(opDesc)));
                } // in case of error an error frame will arrive from server
                this._onConnected.next(); // signal caller we succeeded
            },
            () => { // error
                //-- this.disconnect(); // ignore returns
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
        }
        if(this.broadcastSubscription) {
            this.broadcastSubscription.unsubscribe();
        };
        this.subscription = null;
        this.broadcastSubscription = null;
        this.stompClient = null;
        var err = new Envelope.Response();
        err.errorCode = Envelope.Response.ERROR_DISCONNECTED;
        err.errorDescription = "Disconnected by user";
        this._onError.next(err);
        return true;
    }

    /**
     * Requests history from server
     * @param lastSeen
     */
    public loadHistory(clientID: string, lastSeen: number): number {
        if(this.isConnected()) {
            this.stompClient.send("/app/op.histo", {}, JSON.stringify(new Envelope.LoadHistoryOp(clientID, lastSeen)));
            return Envelope.Response.ERROR_NOT_CONNECTED;
        }
        return Envelope.Response.ERROR_NOT_CONNECTED;
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
            return Envelope.Response.ERROR_NOT_CONNECTED;
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
