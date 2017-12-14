package com.example.websocketdemo.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

/**
 *
 * @author yveretelnikov
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Parcel2 {
    public HelloClient helloClientReq;
    public HelloCliOk helloCliOk;
    public History historyResp;

    public Say say;
    public SayAck sayAck;


    public static class HelloClient{
        public UserDesc userDesc;
    }

    public static class HelloCliOk {
        public String clientID;
    }

    public static class UserDesc {
        public String email;
        public FIO fio;
        public String[] tags;
        public String phone;
        public String otherInfo;
    }

    public static class FIO {
        public String fn;
        public String sn;
        public String ln;
    }

    public static class History extends HelloCliOk {
        public ChatItem[] chatItems;
    }

    public static class ChatItem {
        public long id;
        public String text;
        public String opID;
        public Instant at;
    }

    public static class Say {
        public long cid;
        public String text;
    }

    public static class SayAck {
        public long cid;
        public long id;
        public Instant when;
    }
}
