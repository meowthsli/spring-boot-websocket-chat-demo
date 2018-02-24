/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.config;

import java.util.Arrays;
import java.util.LinkedHashMap;
import javax.annotation.PreDestroy;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteAtomicLong;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.Ignition;
import org.apache.ignite.cache.QueryEntity;
import org.apache.ignite.cache.QueryIndex;
import org.apache.ignite.configuration.CacheConfiguration;
import org.apache.ignite.configuration.IgniteConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.wolna.ouchatserver.model.Conversation;
import org.wolna.ouchatserver.model.Conversations;
import org.wolna.ouchatserver.model.ConversationsImpl;
import org.wolna.ouchatserver.model.Message;
import org.wolna.ouchatserver.model.UserRepository;

/**
 *
 * @author yurij
 */
@Configuration
@EnableJpaRepositories(basePackageClasses = {UserRepository.class})
@EnableTransactionManagement(order = 0)
public class StorageConfig {

    @Bean
    @Lazy
    public Ignite ignite() {
        IgniteConfiguration config = new IgniteConfiguration();
        config.setClientMode(false);
        config.setClassLoader(this.getClass().getClassLoader());
        config.setPeerClassLoadingEnabled(false);

        return Ignition.start(config);
    }

    @Bean
    @Lazy
    public Conversations covs() {
        return new ConversationsImpl();
    }

    @Bean(name = "convsMeta")
    @Lazy
    public IgniteCache<String, Conversation> metas(Ignite ignite) {
        return ignite.getOrCreateCache("metas");
    }

    @Bean(name = "messages")
    @Lazy
    public IgniteCache<Long, Message> messages(Ignite ignite) {
        CacheConfiguration<Long, Message> config = new CacheConfiguration<>("messages");
        QueryEntity qe = new QueryEntity();
        qe.addQueryField("at", "java.time.Instant", "at");
        qe.addQueryField("clientLogin", "java.lang.String", "clientLogin");
        qe.addQueryField("id", "java.lang.Long", "id");

        qe.setKeyFieldName("id");
        qe.setKeyType("java.lang.Long");
        qe.setValueType(Message.class.getCanonicalName());

        QueryIndex qi = new QueryIndex();
        qi.setName("histo_idx");
        LinkedHashMap<String, Boolean> fields = new LinkedHashMap<>();
        fields.put("clientLogin", Boolean.TRUE);
        fields.put("at", Boolean.FALSE);
        fields.put("id", Boolean.FALSE);
        qi.setFields(fields);
        qe.setIndexes(Arrays.asList(qi));

        config.setQueryEntities(Arrays.asList(qe));
        return ignite.getOrCreateCache(config);
    }

    @PreDestroy
    public void destroy() {
        Ignition.stop(true);
    }

    @Bean(name = "messageIdGen")
    IgniteAtomicLong msgids(Ignite ignite) {
        IgniteAtomicLong atomicLong = ignite.atomicLong(
                "messageIdGen", // Atomic long name.
                1000L, // Initial value.
                true);     		// Create if it does not exist.
        return atomicLong;
    }

}
