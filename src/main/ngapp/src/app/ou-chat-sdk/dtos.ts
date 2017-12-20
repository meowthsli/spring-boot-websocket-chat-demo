type USER_ID = string;
type TAG = string;
type PHONE = string;
type EMAIL = string;

// MESSAGES
export class Parcel2 {
    public helloClientReq : HelloClient;
    public historyReq: RequestHistoryCli;
    public historyResp: History;
    public historyReqOp: RequestHistoryOp;
    public sayReq: Say;
    public sayResp: SayAck;
    public requestLock : RequestLock;

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

    public setHistory(hist: RequestHistoryCli) {
        this.historyReq = hist;
        return this;
    }

    public setHistoryOp(hist: RequestHistoryOp) {
        this.historyReqOp = hist;
        return this;
    }

    public setRequestLock(req: RequestLock) {
        this.requestLock = req;
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
 * Message to server
 */
export class OpSay {
    constructor(public cid: number, public text: string, public clientID: string) {
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

/**
 * Request locking of chat
 */
export class RequestLock {
    constructor(public clientID: USER_ID) {

    }
}

/**
 * Lock successfull
 */
export class OkLock {
    constructor(public clientID: USER_ID) {

    }
}

export class RequestHistoryOp {
    constructor(public clientID: USER_ID) {

    }
}

export class HistoryOp extends History {

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

