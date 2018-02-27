package org.wolna.ouchatserver.security;

import java.io.IOException;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.wolna.ouchatserver.controller.ChatController;
import static org.wolna.ouchatserver.security.SecurityConstants.API_KEY_QUERY_STRING;
import static org.wolna.ouchatserver.security.SecurityConstants.LOGIN_QUERY_STRING;

public class ApiKeyAuthenticationFilter extends BasicAuthenticationFilter {

    static Log LOG = LogFactory.getLog(ChatController.class);

    public ApiKeyAuthenticationFilter(AuthenticationManager authManager) {
        super(authManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws IOException, ServletException {

        // 1. Check token query string
        Map<String, String> qps = RequestUtils.getQueryParameters(req);
        if (qps.containsKey(API_KEY_QUERY_STRING) && qps.containsKey(LOGIN_QUERY_STRING)) {
            Authentication authentication = super.getAuthenticationManager().authenticate(
                    new ApiKeyAuthenticationToken(
                            "client:" + qps.get(LOGIN_QUERY_STRING), // principal
                            qps.get(API_KEY_QUERY_STRING) // credentials
                    ));
            if (authentication != null) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(req, res);
    }
}
