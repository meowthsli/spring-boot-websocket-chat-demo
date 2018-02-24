package org.wolna.ouchatserver;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import javax.annotation.PreDestroy;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteAtomicLong;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.Ignition;
import org.apache.ignite.cache.QueryEntity;
import org.apache.ignite.cache.QueryIndex;
import org.apache.ignite.configuration.CacheConfiguration;
import org.apache.ignite.configuration.IgniteConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.wolna.ouchatserver.model.Conversation;
import org.wolna.ouchatserver.model.Message;
import org.wolna.ouchatserver.model.Conversations;
import org.wolna.ouchatserver.model.ConversationsImpl;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl;

@SpringBootApplication
@EnableSpringDataWebSupport
@EnableWebMvc
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

    /**
     * Register JPA session filter before spring security chain
     * @return 
     */
    @Bean
    public FilterRegistrationBean openEntityManagerInViewFilter() {
        FilterRegistrationBean reg = new FilterRegistrationBean();
        reg.setName("OpenEntityManagerInViewFilter");
        reg.setFilter(new OpenEntityManagerInViewFilter());
        reg.setOrder(0);
        return reg;
    }
}
