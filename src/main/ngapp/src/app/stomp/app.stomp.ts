import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { ChatItem } from '../op-chat/app.chat';
import { environment } from '../../environments/environment';

export class StompConnector {
    public incomingMessage = new Subject<any>();
    public onConnected = new Subject<void>();
    public onError = new Subject<string>();

    private socket; 
    private stompClient;
    private opsId;
    private broadcastId;
 
    public connect(clientDesc: ClientDesc) {
        this.clientDesc = clientDesc;
        
        this.socket = new SockJS(environment.wsAddress);
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect(btoa(this.clientDesc.email), '', () => this.onStompConnected(), () => this.onStompError());
    }

    public disconnect() {
        if(this.opsId) {
            this.opsId.unsubscribe();
        }
        if(this.broadcastId) {
            this.broadcastId.unsubscribe();
        }
        this.stompClient.disconnect();
        this.onError.next("Disconnect");
    }

    public send(clientId: string, ci: ChatItem) {
        if(this.opsId) {
            this.stompClient.send("/app/operator.say", {}, JSON.stringify({type: 'SAY', text:ci.text, clientID: clientId, cid:ci.id}));
        }
    }

    public loadHistory(userid: string) {
        if(this.opsId) {
            this.stompClient.send("/app/operator.histo", {}, JSON.stringify({clientID: userid}));
        }
    }

    public tryLock(clientID: string) {
        if(this.opsId) {
            this.stompClient.send("/app/operator.tryLock", {}, JSON.stringify({clientID: clientID}));
        }
    }

    public release(clientID: string) {
        if(this.opsId) {
            this.stompClient.send("/app/operator.release", {}, JSON.stringify({clientID: clientID}));
        }
    }

    public getInfo(info: Array<string>) {
        if(this.opsId) {
            this.stompClient.send("/app/operator.getInfo", {}, JSON.stringify({info: info}));
        }
    }

    onStompConnected() {
        console.log("Stomp connected");
        this.onConnected.next();
    
        this.broadcastId = this.stompClient.subscribe('/broadcast/all-ops', (payload) => this.onStompReceived(payload));
        this.opsId = this.stompClient.subscribe('/user/queue/op', (payload) => 
            this.onStompReceived(payload)
        );
        this.stompClient.send("/app/operator.hello",
            {}, JSON.stringify({clientDesc: this.clientDesc})
        );
      }
    
      onStompError() {
        console.log("Stomp error");
        this.onError.next("Error");
      }
    
      onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }

    private clientDesc: ClientDesc;
}

// SDK

export class ClientDesc {
    constructor(public email: string, public fio: FIO, public tags: Array<string>, public phone: string) {

    }
}

export class FIO {
    constructor(public fn: string, public sn: string, public ln: string) {

    }
}