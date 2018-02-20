/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

/**
 *
 * @author yurij
 */
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.MediaType;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.wolna.ouchatserver.controller.ChatController;

import static org.wolna.ouchatserver.security.SecurityConstants.EXPIRATION_TIME;
import static org.wolna.ouchatserver.security.SecurityConstants.HEADER_STRING;
import static org.wolna.ouchatserver.security.SecurityConstants.SECRET;
import static org.wolna.ouchatserver.security.SecurityConstants.SIGN_UP_URL;
import static org.wolna.ouchatserver.security.SecurityConstants.TOKEN_PREFIX;

public class JwtLoginFilter extends UsernamePasswordAuthenticationFilter {
    static Log LOG = LogFactory.getLog(ChatController.class);
    
    private AuthenticationManager authenticationManager;
    private final ObjectMapper mapper;

    public JwtLoginFilter(AuthenticationManager authenticationManager, ObjectMapper mapper) {
        super();
        super.setFilterProcessesUrl(SIGN_UP_URL);
        this.authenticationManager = authenticationManager;
        this.mapper = mapper;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) throws AuthenticationException {
        try {
            Credentials creds = new ObjectMapper()
                    .readValue(req.getInputStream(), Credentials.class);

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getEmail(),
                            creds.getPassword(),
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {
        String token = Jwts.builder()
                .setSubject(((User) auth.getPrincipal()).getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET.getBytes())
                .compact();
        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", token);
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        mapper.writeValue(res.getWriter(), tokenMap);
        
        LOG.info("Auth successful for user " + ((User) auth.getPrincipal()).getUsername());
    }
}
