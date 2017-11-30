import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';

export class StompConnector {
    public incomingMessage = new Subject<any>();

    private socket; // = new SockJS('http://localhost:8080/ws');
    private stompClient; // = Stomp.over(this.socket);
    private opsId;
    private broadcastId;

    public connect(username: string) {
        var u64 = btoa(username);
        this.socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect(u64, '', () => this.onStompConnected(u64), () => this.onStompError());
    }

    public disconnect() {
        if(this.opsId) {
            this.stompClient.unsubscribe(this.opsId);
        }
        if(this.broadcastId) {
            this.stompClient.unsubscribe(this.broadcastId);
        }
    }

    onStompConnected(username: string) {
        console.log("Stomp connected");
    
        this.broadcastId = this.stompClient.subscribe('/broadcast/all-ops', (payload) => this.onStompReceived(payload));
        this.opsId = this.stompClient.subscribe('/user/queue/op', (payload) => 
            {console.log("USER/OP"); this.onStompReceived(payload);}
        );
        this.stompClient.send("/app/operator.hello",
            {}, JSON.stringify({sender: username})
        );
      }
    
      onStompError() {
        console.log("Stomp error");

      }
    
      onStompReceived(payload) {
        // console.log("StompConnector::onStompReceived, payload=", payload);
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }
}