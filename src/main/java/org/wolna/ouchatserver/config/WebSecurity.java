/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.wolna.ouchatserver.security.ApiKeyAuthenticationFilter;
import org.wolna.ouchatserver.security.ApiKeyAuthenticationProvider;
import org.wolna.ouchatserver.security.JwtAuthenticationFilter;
import org.wolna.ouchatserver.security.JwtAuthenticationProvider;
import org.wolna.ouchatserver.security.JwtLoginFilter;
import static org.wolna.ouchatserver.security.SecurityConstants.SIGN_UP_URL;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class WebSecurity extends WebSecurityConfigurerAdapter {

    private UserDetailsService userDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Autowired
    ObjectMapper mapper;

    public WebSecurity(UserDetailsService userDetailsService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                .antMatchers(HttpMethod.POST, SIGN_UP_URL, "/api/register").permitAll()
                .antMatchers("/WsClient").hasRole("CLIENT")
                .antMatchers("/Ws").hasAnyRole("OPS", "SUPERVISOR")
                .anyRequest().authenticated()
                .and()
                .addFilter(authf()).addFilter(new JwtLoginFilter(authenticationManager(), mapper)).addFilter(apif())
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // this disables session creation on Spring Security
                ;
    }
    
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
        auth.authenticationProvider(jwtProvider());
        auth.authenticationProvider(apikeyProvider());
        auth.eraseCredentials(false);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.addAllowedMethod(HttpMethod.GET);
        cfg.addAllowedMethod(HttpMethod.POST);
        cfg.addAllowedMethod(HttpMethod.PUT);
        cfg.addAllowedMethod(HttpMethod.PATCH);
        cfg.addAllowedMethod(HttpMethod.DELETE);
        cfg.applyPermitDefaultValues();
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
    
    @Bean @Lazy
    AuthenticationProvider jwtProvider() {
        return new JwtAuthenticationProvider();
    }
    
    @Bean @Lazy
    ApiKeyAuthenticationFilter apif() throws Exception {
        return new ApiKeyAuthenticationFilter(authenticationManager());
    }

    @Bean @Lazy
    AuthenticationProvider apikeyProvider() {
        return new ApiKeyAuthenticationProvider();
    }

    
    @Bean @Lazy
    Filter authf() throws Exception {
        return new JwtAuthenticationFilter(authenticationManager());
    }

}