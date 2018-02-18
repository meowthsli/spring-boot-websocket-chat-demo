/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver;

import org.hsqldb.util.DatabaseManagerSwing;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;

/**
 *
 * @author yurij
 */
@Configuration
@Profile("dbman")
public class DBMan {
    @Value("${spring.datasource.url}")
    String dbUrl;
    
    @Bean
    @Lazy(false)
    public Object getDbManager() {
        DatabaseManagerSwing.main(
                new String[]{"--url", dbUrl, "--user", "sa", "--password", ""});
        return null;
    }
}
