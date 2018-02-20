/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import io.jsonwebtoken.Jwts;
import java.io.IOException;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.wolna.ouchatserver.controller.ChatController;
import static org.wolna.ouchatserver.security.SecurityConstants.HEADER_STRING;
import static org.wolna.ouchatserver.security.SecurityConstants.SECRET;
import static org.wolna.ouchatserver.security.SecurityConstants.TOKEN_PREFIX;
import static org.wolna.ouchatserver.security.SecurityConstants.TOKEN_QUERY_STRING;

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
    
    static Log LOG = LogFactory.getLog(ChatController.class);

    public JwtAuthenticationFilter(AuthenticationManager authManager) {
        super(authManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        // Check possibilities
        Authentication authentication = null;
        // 1. Check auth header
        String header = req.getHeader(HEADER_STRING);
        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authentication = getAuthentication(header);
        } else {
            // 2. Check token query string
            Map<String, String> qps = RequestUtils.getQueryParameters(req);
            if(qps.containsKey(TOKEN_QUERY_STRING) && qps.get(TOKEN_QUERY_STRING) != null) {
                authentication = getAuthentication(qps.get(TOKEN_QUERY_STRING));
            }
        }
        
        if(authentication != null) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(req, res);
    }

    private Authentication getAuthentication(String token) {
        // parse the token.
        String email = Jwts.parser()
                .setSigningKey(SECRET.getBytes())
                .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                .getBody()
                .getSubject();

        if (email != null) {
            LOG.info("Request authorized for user " + email);
            return super.getAuthenticationManager().authenticate(new JwtAuthenticationToken(email));
        }

        return null;
    }

    private boolean authenticationIsRequired(String username) {
        // Only reauthenticate if username doesn't match SecurityContextHolder and user
        // isn't authenticated
        // (see SEC-53)
        Authentication existingAuth = SecurityContextHolder.getContext()
                .getAuthentication();

        if (existingAuth == null || !existingAuth.isAuthenticated()) {
            return true;
        }

        // Limit username comparison to providers which use usernames (ie
        // UsernamePasswordAuthenticationToken)
        // (see SEC-348)
        if (existingAuth instanceof UsernamePasswordAuthenticationToken
                && !existingAuth.getName().equals(username)) {
            return true;
        }
        
        return false;

    }
}
