/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.wolna.ouchatserver.model.ApiKey;
import org.wolna.ouchatserver.model.ApiKeyRepository;

/**
 *
 * @author yurij
 */
public class ApiKeyAuthenticationProvider implements AuthenticationProvider {
    
    
    @Autowired
    ApiKeyRepository keys;

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        ApiKey key = keys.findOneByVal(auth.getCredentials().toString());
        if(key == null || key.getIsBlocked()) {
            throw new BadCredentialsException("Api key invalid or blocked");
        }
        ApiKeyAuthenticationToken aa = (ApiKeyAuthenticationToken)auth;
        return aa;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return ApiKeyAuthenticationToken.class.isAssignableFrom(authentication);
    }
    
}
