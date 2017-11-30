import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';

export class ClientStompConnector {
    public incomingMessage = new Subject<any>();

    private socket; // = new SockJS('http://localhost:8080/ws');
    private stompClient; // = Stomp.over(this.socket);
    private clientId;
    private u64;

    public connect(username: string) {
        if(!this.clientId) {
            this.u64 = btoa(username);
            this.socket = new SockJS('http://localhost:8080/ws');
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.connect(this.u64, '', () => this.onStompConnected(), () => this.onStompError());
        }
    }

    public disconnect() {
        if(this.clientId) {
            this.stompClient.unsubscribe(this.clientId);
            this.clientId = null;
        }
    }

    public send(text: string) {
        if(this.clientId) {
            this.stompClient.send("/app/client.say", {}, JSON.stringify({type: 'CHAT', sender:this.u64, text:text}));
        }
    }

    onStompConnected() {
        console.log("Stomp connected");
    
        this.clientId = this.stompClient.subscribe('/user/queue/client', (payload) => 
            {console.log("USER/CLIENT"); this.onStompReceived(payload);}
        );
        this.stompClient.send("/app/client.hello",
            {}, JSON.stringify({sender: this.u64})
        );
      }
    
      onStompError() {
        console.log("Stomp error");

      }
    
      onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }
}