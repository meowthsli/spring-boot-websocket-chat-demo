import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import * as moment from 'moment';
import { NbSpinnerService } from '@nebular/theme';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { ToasterConfig } from 'angular2-toaster';
import { environment } from '../../environments/environment';
import { OUChatClientConnectorImpl } from '../connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/impl/client-connector';
import { OUChatOpConnectorImpl } from '../connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/impl/ops-connector';
import { Envelope } from '../connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/Envelope';
import { Moment } from 'moment';
import { Attachment } from '../attachment/models/attachment.model';
import { UploaderService } from '../attachment/uploader/uploader.service';

type CONNECTOR = OUChatClientConnectorImpl;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public readonly fromNow: string = moment().fromNow();
  public attachment: Attachment = null;

  $text: string;
  $history: Array<ChatItem> = new Array();
  $connectionPhase: number = 0;

  /**
   *  Bulb alerts
   */
  $toasterconfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 0,
    limit: 1,
  });

  constructor(private router:Router, private uctx: UsercontextService,
              private connector: OUChatClientConnectorImpl,
              private spinner: NbSpinnerService, private toaster: ToasterService,
              private uploader: UploaderService) {}

  /**
   *  Send message button event handler
   */
  public $onSendClick() {
    if(this.$text) {
      var id = this.connector.say(this.$text);
      let ci = new ChatItem(id, true, this.$text, moment(), id);
      this.$history.push(ci);
      this.$text = null;
      this.scrollDown();
    }
  }

  ngOnInit(): void {
    if(!this.uctx.username) { // return if no name installed
      this.router.navigateByUrl(''), {skipLocationChange: false};
      return;
    }

    this.connector.onConnected(()=> {
      this.spinner.clear();
      this.$connectionPhase = 2; // connection succeeded
      this.connector.loadHistory(0);
    });
    this.connector.onError(()=> this.onDisconnect());
    this.connector.onResult( r => {
      if(r.messageAccepted) {
        var mm = r.messageAccepted;
        var item = this.$history.find(ci => ci.id == mm.messageTemporaryId);
        if (item) {
          item.id = mm.messageId;
        }
      } else if (r.fileMessageAccepted) {
        let mm = r.fileMessageAccepted;
        let item = this.$history.find(ci => ci.id == mm.messageTemporaryId);
        if (item) {
          item.id = mm.messageId;
        }
      } else if (r.messages) {
        // Мерджим сообщения (оставляем уникальные)
        this.$history = r.messages.messages
          .concat(r.messages.fileMessages)
          .map(m => new ChatItem(m.id, m.fromClient, m.text, moment(m.dateAt)))
          .concat(this.$history)
          .filter((message, index, messages) => messages.indexOf(messages.find(m => m.id === message.id)) === index)
          .sort((messageA, messageB) => messageA.at.valueOf() - messageB.at.valueOf());
        this.scrollDown();

        /*if(msg.historyResp) {
			this.clientID = msg.historyResp.clientID;
			for(var ci of msg.historyResp.chatItems) {
				this.$history.push(new ChatItem(ci.id, ci.opID, ci.text, moment(ci.at*1000)));
			}
			this.scrollDown();
		}*/
      }
    });

    this.beginConnect();
  }

  private beginConnect() {
    this.$connectionPhase = 1; // connecting..
    this.spinner.load();

    let email = `${this.uctx.username}-cli@acme.org`;  // TODO: use actual email
    this.connector.connect(
      environment.wsAddress + "Client",
      this.uctx.apiKey,
      new Envelope.UserDescription("login1", "fio fio", [])
    );
  }

  private onDisconnect() {
    this.spinner.clear();
    this.$connectionPhase = 0; // not connected

    let toast = this.toaster.pop("warning", "Нет связи с сервером", "Кликните, чтобы соединиться");
    toast.showCloseButton = true;

    // try to connect again on click
    toast.clickHandler = (toast, button) => {
      this.toaster.clear();
      this.beginConnect()
      return true;
    }
  }

  private scrollDown() { // TODO: fix hack!
    setTimeout(() =>  {
      let element = document.getElementById('chat-lines');
      element.scrollTop = element.scrollHeight ;
    }, 0);
  }

  /**
   * Upload Attachment
   *
   * @param {Attachment} attachment
   */
  public onFileUpload(attachment: Attachment): void {
    this.uploader.confirm(attachment)
      .then(a => {
        this.attachment = a;


        const id = this.connector.sendFile(a.data, a.filename);
        const ci = new ChatItem(id, true, a.filename, moment(), id);
        this.$history.push(ci);
        this.scrollDown();


        console.log(attachment); // TODO: send attachment
      })
      .catch(cancel => {

      });
  }
}

/**
 * To store chat items
 */
export class ChatItem {
  public constructor(
    public id: number,
    public isFromClient: boolean,
    public text: string,
    public at: Moment,
    public tempId: number = null,
  ) {}

  public wasDelivered(): boolean {
    return !this.tempId || this.id !== this.tempId;
  }
}
