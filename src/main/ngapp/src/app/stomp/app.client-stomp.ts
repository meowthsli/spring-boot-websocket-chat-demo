import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { ChatItem } from '../client-chat/app.client-chat';

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

    public send(ci: ChatItem) {
        if(this.clientId) {
            this.stompClient.send("/app/client.say", {}, JSON.stringify({type: 'SAY', text:ci.text, cid: ci.id}));
        }
    }

    onStompConnected() {
        console.log("Stomp connected");
    
        this.clientId = this.stompClient.subscribe('/user/queue/client', (payload) => 
            this.onStompReceived(payload)
        );
        this.stompClient.send("/app/client.hello",
            {}, JSON.stringify({clientID: this.u64})
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