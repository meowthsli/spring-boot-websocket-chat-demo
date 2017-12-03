import { Component, Output, EventEmitter } from "@angular/core";
import { StompConnector } from "../stomp/app.stomp";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";


@Component({
    selector: 'chat-client-queue',
    templateUrl: './app.client-queue.html'
  })
export class ClientQueueComponent implements OnInit {
    // bindings
    public $queue: Array<QueueItem> = new Array();
    @Output() public $clientOpen: EventEmitter<String> = new EventEmitter();

    // methods
    public constructor(private stomp: StompConnector) {}
    
    ngOnInit(): void {
        this.stomp.incomingMessage.subscribe(msg => this.onMessage(msg));
    }

    private onMessage(p:any) {
        if(p.type === "OP_UNREAD_LIST") {
            if(p.chatItems && p.chatItems.length > 0) {
                let qi = this.$queue.find(qi => qi.userid == p.author);
                if(!qi) {
                    this.$queue.push(new QueueItem(atob(p.author), p.author, p.chatItems[0].text, p.chatItems[0].id));
                } else {
                    qi.text = p.chatItems[0].text;
                }
            }
        }

        if(p.type === "CHAT") {
            var qi = this.$queue.find(qi => qi.userid == p.to);
            if(!qi) {
                qi = this.$queue.find(qi => qi.userid == p.author);
            }
            if(qi) {
                qi.id = p.ack;
                qi.text = p.text;
            } else {

                this.$queue.push(new QueueItem("??", p.to? p.to : p.author, p.text, p.ack));
            }

        }
    }
}

// item to show
export class QueueItem {
    public constructor(public author: String, public userid: string, public text: String, public id: number){

    }
}