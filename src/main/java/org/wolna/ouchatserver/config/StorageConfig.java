/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.config;

import java.nio.file.Paths;
import javax.annotation.PreDestroy;
import javax.cache.expiry.Duration;
import javax.cache.expiry.ModifiedExpiryPolicy;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.Ignition;
import org.apache.ignite.configuration.CacheConfiguration;
import org.apache.ignite.configuration.DataRegionConfiguration;
import org.apache.ignite.configuration.DataStorageConfiguration;
import org.apache.ignite.configuration.IgniteConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
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
    @Lazy @ConditionalOnMissingBean
    public Ignite ignite() {
        IgniteConfiguration config = new IgniteConfiguration();
        config.setClientMode(false);
        config.setClassLoader(this.getClass().getClassLoader());
        config.setPeerClassLoadingEnabled(false);
        
        DataStorageConfiguration dscfg = new DataStorageConfiguration();
        DataRegionConfiguration drc = new DataRegionConfiguration();
        drc.setName(dscfg.getDefaultDataRegionConfiguration().getName());
        drc.setPersistenceEnabled(true);
        drc.setMaxSize(1*1024*1024*1024);
        dscfg.setDefaultDataRegionConfiguration(drc);  
        
        String cwd = Paths.get("").toAbsolutePath().toString();
        dscfg.setStoragePath(cwd + "/store/ignite/data");
        dscfg.setWalPath(cwd + "/store/ignite/wal");
        
        config.setDataStorageConfiguration(dscfg);

        Ignite i = Ignition.start(config);
        i.active(true);
        return i;
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
    
    @Bean(name = "convLocks")
    @Lazy
    public IgniteCache<String, String> locks(Ignite ignite) {
        CacheConfiguration<String, String> config = new CacheConfiguration<>("convLocks");
        config.setExpiryPolicyFactory(ModifiedExpiryPolicy.factoryOf(Duration.FIVE_MINUTES));
        return ignite.getOrCreateCache(config);
    }

    @Bean(name = "messages")
    @Lazy
    public IgniteCache<Long, Message> messages(Ignite ignite) {
        CacheConfiguration<Long, Message> config = new CacheConfiguration<>("messages");
        config.setStatisticsEnabled(true);
        config.setDataRegionName(ignite.configuration().getDataStorageConfiguration().getDefaultDataRegionConfiguration().getName());
        // config.setWriteBehindEnabled(true);
                
        config.setIndexedTypes(Long.class, Message.class);
        IgniteCache<Long, Message> cache = ignite.getOrCreateCache(config);
        
        //SqlFieldsQuery qry = new SqlFieldsQuery("CREATE INDEX search_msgs ON Message (clientLogin ASC, msgId DESC);");
        //qry.setSchema("PUBLIC");
        //cache.query(qry);
        
        return cache;
    }

    @PreDestroy
    public void destroy() {
        Ignition.stop(true);
    }

}
