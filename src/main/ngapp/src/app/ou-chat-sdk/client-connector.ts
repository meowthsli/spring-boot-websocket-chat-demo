import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';

import { HelloClient, Parcel2, UserDesc, RequestHistoryCli, Say } from './dtos';

type USER_ID = string;

/**
 * Client connector
 */
export class OUChatClientConnector {
    /**
     * When connected
     */
    public onConnected = new Subject<void>();
    /**
     * Incoming message
     */
    public onMessage = new Subject<Parcel2>();    
    /**
     * Communication error
     */
    public onError = new Subject<string>();

    /**
     * Set up connection
     * @param login User login. Use ENTERPRISE KEY for client, or email for operator/supervisor
     * @param passcode user password. Use ENTERPRISE KEY for client, or password for operator/supervisor
     * @param uri endpoint uri
     * @param clientDesc client description
     */
    public connect(login: string, passcode: string, uri: string, clientDesc: UserDesc) : void {
        this.disconnect(); // ignore result
        
        // Recreate socket
        this.socket = new SockJS(uri);
        this.stompClient = Stomp.over(this.socket);

        // Open socket again
        this.stompClient.connect(login, passcode, 
            () => {
                // subscribe
                this.onConnected.next();

                this._initialConnect(clientDesc); 
            },
            () => { // error 
                // TODO: event;
                this.disconnect();
                this.onError.next("Error while communication");
            }
        );
    }

    /**
     * Close and disconnect
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
            this.onError.next("Disconnected");
            return true;
        }
        return false;
    }

    /**
     * Ask server for history. clientID is ignored
     */
    public requestHistory(clientID: USER_ID) : boolean {
        if(this.isConnected()) {
            this.stompClient.send("/app/client.histo", {}, JSON.stringify(new Parcel2().setRequestHistory(new RequestHistoryCli())));
            return true;
        } 
        return false;
    }

    /**
     * Send message to server. clientID is ignored
     * @param text 
     */
    public say(cid: number, text: string, clientID: string) {
        if(this.isConnected()) {
            this.stompClient.send("/app/client.say", {}, JSON.stringify(new Parcel2().setSay(new Say(cid, text))));
            return true;
        } 
        return false;
    }

    protected _initialConnect(clientDesc: UserDesc) {
        this.subscription = this.stompClient.subscribe('/user/queue/client', (payload) => this.onStompReceived(payload));
        this.stompClient.send("/app/client.hello", {}, JSON.stringify(new Parcel2().setHelloClient(new HelloClient(clientDesc))));
    }

    /**
     * When message arrives
     * @param payload message
     */
    protected onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        this.onMessage.next(message);
    }

    protected isConnected() : boolean {
        return this.subscription;
    }
    
    protected subscription;
    protected socket;
    protected stompClient;
}