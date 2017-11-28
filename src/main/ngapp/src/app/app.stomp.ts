import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs/Subject';

export class StompConnector {
    public incomingMessage = new Subject<any>();

    private socket = new SockJS('http://localhost:8080/ws');
    private stompClient = Stomp.over(this.socket);
    private opsId;

    public connect(username: string) {
        this.stompClient.connect({}, () => this.onStompConnected(username), () => this.onStompError());
    }

    public disconnect() {
        if(this.opsId) {
            this.stompClient.unsubscribe(this.opsId);
        }
    }

    onStompConnected(username: string) {
        console.log("Stomp connected");
    
        this.opsId = this.stompClient.subscribe('/broker/ops', (payload) => this.onStompReceived(payload));
        this.stompClient.send("/app/operator.hello",
            {}, JSON.stringify({sender: username})
        );
      }
    
      onStompError() {
        console.log("Stomp error");

      }
    
      onStompReceived(payload) {
          console.log("StompConnector::onStompReceived, payload=", payload);
        var message = JSON.parse(payload.body);
        this.incomingMessage.next(message);
      }
}