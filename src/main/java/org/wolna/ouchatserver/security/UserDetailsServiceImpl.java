/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    BCryptPasswordEncoder encoder;
    
    public UserDetailsServiceImpl() {
        
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if(username == null) {
            throw new IllegalArgumentException("username cannot be null");
        }
        
        if(username.toLowerCase().startsWith("a")) {
            return new User(username, encoder.encode("password"), Collections.EMPTY_LIST);
        }
        
        return null;
    }
}