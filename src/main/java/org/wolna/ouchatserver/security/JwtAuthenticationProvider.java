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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 *
 * @author yurij
 */
public class JwtAuthenticationProvider implements AuthenticationProvider {
    
    @Autowired
    UserDetailsService userLoader;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        JwtAuthenticationToken ja = (JwtAuthenticationToken)authentication;
        UserDetails ud = userLoader.loadUserByUsername(ja.getEmail());
        if(ud == null) {
            throw new UsernameNotFoundException("User not found");
        }
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(ud,
                ud.getPassword(), auths());
        return token;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
    
    private static Collection<? extends GrantedAuthority> auths() {
        Set<GrantedAuthority> auth = new HashSet<>();
        auth.add(new SimpleGrantedAuthority("ROLE_OPS"));
        return auth;
    }
    
}
