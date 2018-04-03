package org.wolna.ouchatserver.config;

import java.security.Principal;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.wolna.ouchatserver.security.WSInterceptor;

/**
 *
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/Ws").addInterceptors(intr()).setAllowedOrigins("*");
        registry.addEndpoint("/WsClient").addInterceptors(intr())
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
                        Authentication auth =  SecurityContextHolder.getContext().getAuthentication();
                        return auth;
                    }
                })
                .setAllowedOrigins("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/broadcast", "/queue");

    }
    

    @Bean
    WSInterceptor intr() {
        return new WSInterceptor();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        super.configureWebSocketTransport(registration); //To change body of generated methods, choose Tools | Templates.
        registration.setMessageSizeLimit(5*1024*1024);
        registration.setSendBufferSizeLimit(5*1024*1024);
    }
}
