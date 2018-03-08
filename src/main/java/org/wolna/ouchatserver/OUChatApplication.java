package org.wolna.ouchatserver;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.wolna.ouchatserver.controller.ClientInfo;
import org.wolna.ouchatserver.model.Events;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl;

@SpringBootApplication
@EnableSpringDataWebSupport
@EnableWebMvc
public class OUChatApplication {

    static Log LOG = LogFactory.getLog(OUChatApplication.class);
    
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
    
    @Bean
    public ClientInfo getCI() {
        return new ClientInfo();
    }
    
    @EventListener
    public void handleNewCompanyListener(Events.NewCompany event) {
        LOG.info("New company created: " + event);
    }
}
