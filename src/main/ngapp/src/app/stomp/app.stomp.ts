import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';

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

    public send(text: string, to: string) {
        if(this.opsId) {
            this.stompClient.send("/app/operator.say", {}, JSON.stringify({type: 'CHAT', text:text, to: to}));
        }
    }

    onStompConnected() {
        console.log("Stomp connected");
    
        this.broadcastId = this.stompClient.subscribe('/broadcast/all-ops', (payload) => this.onStompReceived(payload));
        this.opsId = this.stompClient.subscribe('/user/queue/op', (payload) => 
            {console.log("USER/OP"); this.onStompReceived(payload);}
        );
        this.stompClient.send("/app/operator.hello",
            {}, JSON.stringify({author: this.u64})
        );
      }
    
      onStompError() {
        setTimeout(()=> {
            this.stompClient.connect(this.u64, '', () => this.onStompConnected(), () => this.onStompError());
        }, 10000);
      }
    
      onStompReceived(payload) {
        // console.log("StompConnector::onStompReceived, payload=", payload);
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }
}