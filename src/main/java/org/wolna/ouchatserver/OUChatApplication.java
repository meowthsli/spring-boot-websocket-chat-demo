package org.wolna.ouchatserver;

import javax.annotation.PostConstruct;
import org.hsqldb.util.DatabaseManagerSwing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl;

@SpringBootApplication
public class OUChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(OUChatApplication.class, args);
    }

    // To store passwords encrypted
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService uds() {
        return new UserDetailsServiceImpl();
    }
}
