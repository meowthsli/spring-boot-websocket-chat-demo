/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl.SecurityUser;

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
        if (!ud.isAccountNonLocked()){
            throw new LockedException("User account is locked");
        }
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(ud,
                ud.getPassword(), auths(((SecurityUser)ud).getUser().isSupervisor()));
        return token;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
    
    public static Collection<? extends GrantedAuthority> auths(boolean isSupervisor) {
        Set<GrantedAuthority> auth = new HashSet<>();
        if(isSupervisor) {
            auth.add(new SimpleGrantedAuthority("ROLE_SUPERVISOR"));
        } else {
            auth.add(new SimpleGrantedAuthority("ROLE_OPERATOR"));
        }
        return auth;
    }
    
}
