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

//@Transactional(propagation = Propagation.MANDATORY)
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
        
        org.wolna.ouchatserver.model.User uu = userRepo.findByEmail(username);
        if(uu != null) {
            return new SecurityUser(uu);
        }
        
        throw new UsernameNotFoundException("User not found");
    }
    
    public static class SecurityUser extends User {

        private final org.wolna.ouchatserver.model.User uu;
        
        public SecurityUser(org.wolna.ouchatserver.model.User uu) {
            super(uu.getEmail(), uu.getEncodedPassword(), Collections.EMPTY_SET);
            this.uu = uu;
        }
        
        public org.wolna.ouchatserver.model.User getUser() {
            return this.uu;
        }
    }
}