/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

/**
 *
 * @author yurij
 */
public class ApiKeyAuthenticationToken extends AnonymousAuthenticationToken {

    private static final Collection<? extends GrantedAuthority> AUTHS = auths();

    private final String apiKey;
     
    public ApiKeyAuthenticationToken(String login, String apiKey) {
        super(apiKey, login, AUTHS);
        this.apiKey = apiKey;
    }

    @Override
    public Object getCredentials() {
        return apiKey;
    }
    
    private static Collection<? extends GrantedAuthority> auths() {
        Set<GrantedAuthority> auth = new HashSet<>();
        auth.add(new SimpleGrantedAuthority("ROLE_CLIENT"));
        return auth;
    }
}
