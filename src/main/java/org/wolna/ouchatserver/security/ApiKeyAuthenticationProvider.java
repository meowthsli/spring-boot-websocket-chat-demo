package org.wolna.ouchatserver.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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
