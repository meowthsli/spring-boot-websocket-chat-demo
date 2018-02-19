/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

import java.util.Collections;
import org.springframework.security.authentication.AbstractAuthenticationToken;

/**
 *
 * @author yurij
 */
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final String email;

    public JwtAuthenticationToken(String email) {
        super(Collections.EMPTY_SET);
        this.email = email;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return super.getDetails();
    }
    
    public 

    String getEmail() {
        return this.email;
    }
}
