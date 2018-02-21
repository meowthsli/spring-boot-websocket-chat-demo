/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.wolna.ouchatserver.model.UserRepository;

/**
 *
 * @author yurij
 */
@Configuration
@EnableJpaRepositories(basePackageClasses = {UserRepository.class})
@EnableTransactionManagement(order = 0)
public class StorageConfig {
        
}
