/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.wolna.ouchatserver.controller.ChatController;
import org.wolna.ouchatserver.model.ApiKey;
import org.wolna.ouchatserver.model.ApiKeyRepository;
import static org.wolna.ouchatserver.security.SecurityConstants.API_KEY_QUERY_STRING;

public class ApiKeyAuthenticationFilter extends BasicAuthenticationFilter {

    static Log LOG = LogFactory.getLog(ChatController.class);

    public ApiKeyAuthenticationFilter(AuthenticationManager authManager) {
        super(authManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws IOException, ServletException {

        // 1. Check token query string
        Map<String, String> qps = RequestUtils.getQueryParameters(req);
        if (qps.containsKey(API_KEY_QUERY_STRING) && qps.get(API_KEY_QUERY_STRING) != null) {
            super.getAuthenticationManager().authenticate(
                    new AnonymousAuthenticationToken(
                    "ANO", qps.get(API_KEY_QUERY_STRING) + ":" + UUID.randomUUID().toString(),
                    auths()));
        }

        chain.doFilter(req, res);
    }

    private Collection<? extends GrantedAuthority> auths() {
        Set<GrantedAuthority> auth = new HashSet<>();
        auth.add(new SimpleGrantedAuthority("ROLE_CLIENT"));
        return auth;
    }
}
