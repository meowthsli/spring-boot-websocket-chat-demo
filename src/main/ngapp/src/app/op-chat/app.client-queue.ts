import { Component } from "@angular/core";
import { StompConnector } from "../stomp/app.stomp";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
    selector: 'chat-client-queue',
    templateUrl: './app.client-queue.html'
  })
export class ClientQueueComponent implements OnInit {
    // bindings
    public $queue: Array<QueueItem> = new Array();

    // methods
    public constructor(private stomp: StompConnector) {}
    
    ngOnInit(): void {
        this.stomp.incomingMessage.subscribe(msg => this.onMessage(msg));
    }

    private onMessage(p:any) {
        if(p.type === "OP_UNREAD_LIST") {
            this.$queue.push(new QueueItem(atob(p.author), p.chatItems[0].text, p.chatItems[0].id));
        }  
    }
}

// item to show
export class QueueItem {
    public constructor(public username: String, public text: String, public id: number){

    }
}