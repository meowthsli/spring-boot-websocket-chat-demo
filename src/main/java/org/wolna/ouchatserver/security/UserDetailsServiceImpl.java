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
import org.wolna.ouchatserver.model.UserRepository;

public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    BCryptPasswordEncoder encoder;
    
    @Autowired
    UserRepository userRepo;
    
    public UserDetailsServiceImpl() {
        
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if(username == null) {
            throw new IllegalArgumentException("username cannot be null");
        }
        
        if(true/*username.toLowerCase().startsWith("a")*/) {
            return new User(username, encoder.encode("password"), Collections.EMPTY_LIST);
            // org.wolna.ouchatserver.model.User uu = userRepo.findByEmail(username);
            // if(uu != null) {
            //    return new User(uu.email, uu.encodedPassword, Collections.EMPTY_LIST);
            //}
        }
        
        throw new UsernameNotFoundException("User not found");
    }
}