import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { ChatItem } from '../op-chat/app.chat';

export class StompConnector {
    public incomingMessage = new Subject<any>();

    private socket; // = new SockJS('http://localhost:8080/ws');
    private stompClient; // = Stomp.over(this.socket);
    private opsId;
    private broadcastId;
    private u64: String;

    public connect(username: string) {
        this.u64 = btoa(username);
        this.socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect(this.u64, '', () => this.onStompConnected(), () => this.onStompError());
    }

    public disconnect() {
        if(this.opsId) {
            this.stompClient.unsubscribe(this.opsId);
        }
        if(this.broadcastId) {
            this.stompClient.unsubscribe(this.broadcastId);
        }
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

    onStompConnected() {
        console.log("Stomp connected");
    
        this.broadcastId = this.stompClient.subscribe('/broadcast/all-ops', (payload) => this.onStompReceived(payload));
        this.opsId = this.stompClient.subscribe('/user/queue/op', (payload) => 
            this.onStompReceived(payload)
        );
        this.stompClient.send("/app/operator.hello",
            {}, JSON.stringify({opID: this.u64})
        );
      }
    
      onStompError() {
        
      }
    
      onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }
}