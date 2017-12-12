import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';
import { ChatItem } from '../client-chat/app.client-chat';
import { environment } from '../../environments/environment';
import { ClientDesc } from './app.stomp';

export class ClientStompConnector {
    public incomingMessage = new Subject<any>();
    public onConnected = new Subject<void>();
    public onError = new Subject<string>();

    private socket;
    private stompClient;
    private clientId;
    private clientDesc: ClientDesc;

    public connect(clientDesc: ClientDesc) {
        if(!this.clientId) {            
            this.clientDesc = clientDesc;
            this.socket = new SockJS(environment.wsAddress);
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.connect(btoa(this.clientDesc.email), '', () => this.onStompConnected(), () => this.onStompError());
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
    
        this.clientId = this.stompClient.subscribe('/user/queue/client', (payload) => this.onStompReceived(payload));
        this.stompClient.send("/app/client.hello", {}, JSON.stringify({clientDesc: this.clientDesc}));
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