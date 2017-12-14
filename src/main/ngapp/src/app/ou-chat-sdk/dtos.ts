type USER_ID = string;
type TAG = string;
type PHONE = string;
type EMAIL = string;

// MESSAGES
export class Parcel2 {
    public helloClientReq : HelloClient;
    public historyReq: RequestHistoryCli;
    public historyResp: History;
    public sayReq: Say;
    public sayResp: SayAck;

    public setHelloClient(hc: HelloClient) {
        this.helloClientReq = hc;
        return this;
    }

    public setRequestHistory(rhc: RequestHistoryCli) {
        this.historyReq = rhc;
        return this;
    }
    
    public setSay(say: Say) {
        this.sayReq = say;
        return this;
    }
}

/**
 * Hello message
 */
export class HelloClient {
    constructor(public clientDesc: UserDesc) {
    }
}

export class HelloOk {
    constructor(public clientID: USER_ID, public chatItems: Array<ChatItem>) {

    }
}

/**
 * History request
 */
export class RequestHistoryCli {
    constructor() {

    }
    // TODO: params
}

export class History extends HelloOk {

}

/**
 * Message to server
 */
export class Say {
    constructor(public cid: number, public text: string) {
    }
}

/**
 * Message acknowledgement
 */
export class SayAck {
    constructor(public cid: number, public ack: number, public when: number) {
    }
}

/**
 *  Op hello
 */
export class HelloOp {
    constructor(public userDesc: UserDesc) {
    }
}

// DATA

/**
 * User description. Any field is optional
 */
export class UserDesc {
    constructor(public email: EMAIL, public fio: FIO, public tags: Array<TAG>, public phone: PHONE, public otherInfo: string) {
    }
}

/**
 * User name and so on. Any field is optional
 */
export class FIO {
    constructor(public fn: string, public sn: string, public ln: string) {
    }
}

/**
 * Single message from chat
 */
export class ChatItem {
    constructor(public text: string, public id: number, public opID: USER_ID, public at: number) {
    }
}

