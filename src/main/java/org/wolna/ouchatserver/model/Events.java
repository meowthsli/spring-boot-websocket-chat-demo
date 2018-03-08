package org.wolna.ouchatserver.model;

import org.springframework.context.ApplicationEvent;

/**
 *
 * @author yurij
 */
public final class Events {
    private Events() {
        
    }
    
    public static class ChatEvent<T> extends ApplicationEvent {
        
        public ChatEvent() {
            super(new Object());
        }
    }
    
    public static class UserConnected extends ChatEvent<UserConnected> {
        public String clientID;
        public String operatorLogin;
    }
    
    public static class MessageArrived extends ChatEvent<MessageArrived> {
        public String clientID;
        public String operatorLogin;
    }
    
    public static class NewCompany extends ChatEvent<NewCompany> {
        public String operatorLogin;
        public Company companyID;
    }

}
