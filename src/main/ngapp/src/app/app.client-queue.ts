import { Component } from "@angular/core";
import { StompConnector } from "./app.stomp";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
    selector: 'chat-client-queue',
    templateUrl: './app.client-queue.html'
  })
export class ClientQueueComponent implements OnInit {

    constructor(private stomp:StompConnector) {
        
    }

    ngOnInit(): void {
        this.stomp.incomingMessage.subscribe(this.onMessage);
    }

    private onMessage(payload:any) {
        // console.log('ClientQueueComponent::onMessage: ', payload);
    }
}