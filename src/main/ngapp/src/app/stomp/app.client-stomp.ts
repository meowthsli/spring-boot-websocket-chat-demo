import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { ChatItem } from '../client-chat/app.client-chat';

export class ClientStompConnector {
    public incomingMessage = new Subject<any>();
    public onConnected = new Subject<void>();
    public onError = new Subject<string>();

    private socket; // = new SockJS('http://localhost:8080/ws');
    private stompClient; // = Stomp.over(this.socket);
    private clientId;
    private username: string;

    public connect(username: string) {
        if(!this.clientId) {
            this.username = username;
            this.socket = new SockJS('http://localhost:8080/ws');
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.connect(btoa(this.username), '', () => this.onStompConnected(), () => this.onStompError());
        }
    }

    public disconnect() {
        if(this.clientId) {
            console.log("Disconnected");
            this.stompClient.unsubscribe(this.clientId);
            this.clientId = null;
            this.stompClient.disconnect();
            this.onError.next("Disconnected");
        }
    }

    public send(ci: ChatItem) {
        if(this.clientId) {
            this.stompClient.send("/app/client.say", {}, JSON.stringify({type: 'SAY', text:ci.text, cid: ci.id}));
        }
    }

    onStompConnected() {
        this.onConnected.next();
    
        this.clientId = this.stompClient.subscribe('/user/queue/client', (payload) => 
            this.onStompReceived(payload)
        );
        this.stompClient.send("/app/client.hello",
            {}, JSON.stringify({clientDesc: { 
                email: this.username,
                realName: 'Иван Иванов [' + this.username + ']'
            }})
        );
      }
    
      onStompError() {
        console.log("Stomp error");
        this.onError.next("Disconnected");
      }
    
      onStompReceived(payload) {
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }
}