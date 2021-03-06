/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.security;

/**
 *
 * @author yurij
 */
public class SecurityConstants {
    public static final String SECRET = "OUChatSecretToken";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "JWT ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/api/login";
    public static final String TOKEN_QUERY_STRING = "jwt";
    public static final String API_KEY_QUERY_STRING = "api_key";
    public static final String LOGIN_QUERY_STRING = "login";
}