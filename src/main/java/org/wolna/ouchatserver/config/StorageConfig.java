/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.config;

import java.nio.file.Paths;
import java.util.HashMap;
import javax.annotation.PreDestroy;
import javax.cache.expiry.Duration;
import javax.cache.expiry.ModifiedExpiryPolicy;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.IgniteFileSystem;
import org.apache.ignite.Ignition;
import org.apache.ignite.configuration.CacheConfiguration;
import org.apache.ignite.configuration.DataRegionConfiguration;
import org.apache.ignite.configuration.DataStorageConfiguration;
import org.apache.ignite.configuration.FileSystemConfiguration;
import org.apache.ignite.configuration.IgniteConfiguration;
import org.apache.ignite.igfs.IgfsMode;
import org.apache.ignite.igfs.secondary.local.LocalIgfsSecondaryFileSystem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
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
    @Value("${app.path-to-storage}")
    String pathToStorage;

    @Bean(name = "ignite")
    @Lazy @ConditionalOnMissingBean
    public Ignite ignite() {
        IgniteConfiguration config = new IgniteConfiguration();
        config.setClientMode(false);
        config.setClassLoader(this.getClass().getClassLoader());
        config.setPeerClassLoadingEnabled(false);
        
        DataStorageConfiguration dscfg = new DataStorageConfiguration();
        
        DataRegionConfiguration drcMessages = new DataRegionConfiguration();
        drcMessages.setName("Messages");
        drcMessages.setPersistenceEnabled(true);
        drcMessages.setMaxSize(500L*1024*1024);
        
        DataRegionConfiguration drcMeta = new DataRegionConfiguration();
        drcMeta.setName("Meta");
        drcMeta.setPersistenceEnabled(true);
        drcMeta.setMaxSize(500L*1024*1024);
        dscfg.setDataRegionConfigurations(drcMessages, drcMeta);  
        
        String cwd = Paths.get("").toAbsolutePath().toString();
        dscfg.setStoragePath(cwd + pathToStorage + "/data");
        dscfg.setWalPath(cwd + pathToStorage + "/wal");
        
        config.setDataStorageConfiguration(dscfg);
        
        FileSystemConfiguration fsConfig = new FileSystemConfiguration();
        fsConfig.setName("userFiles");
        fsConfig.setDefaultMode(IgfsMode.DUAL_ASYNC);
        fsConfig.setPathModes(new HashMap<String,IgfsMode>() {
                {
                    put("/tmp/.*", IgfsMode.PRIMARY);
                }
        });      
        
        LocalIgfsSecondaryFileSystem secFs = new LocalIgfsSecondaryFileSystem();
        secFs.setWorkDirectory(cwd + pathToStorage + "/data/fs");
        fsConfig.setSecondaryFileSystem(secFs);
        
        config.setFileSystemConfiguration(fsConfig);

        Ignite i = Ignition.start(config);
        i.active(true);
        return i;
    }

    @Bean
    @Lazy
    public Conversations covs() {
        return new ConversationsImpl();
    }

    @Bean(name = "convsMeta") @Lazy @DependsOn("ignite")
    public IgniteCache<String, Conversation> metas(Ignite ignite) {
        CacheConfiguration<String, Conversation> config = new CacheConfiguration<>("metas");
        config.setDataRegionName("Meta");
        return ignite.getOrCreateCache(config);
    }
    
    @Bean(name = "convLocks") @Lazy @DependsOn("ignite")
    public IgniteCache<String, String> locks(Ignite ignite) {
        CacheConfiguration<String, String> config = new CacheConfiguration<>("convLocks");
        config.setExpiryPolicyFactory(ModifiedExpiryPolicy.factoryOf(Duration.FIVE_MINUTES));
        config.setDataRegionName("Meta");
        return ignite.getOrCreateCache(config);
    }

    @Bean(name = "messages") @Lazy @DependsOn("ignite")
    public IgniteCache<Long, Message> messages(Ignite ignite) {
        CacheConfiguration<Long, Message> config = new CacheConfiguration<>("messages");
        config.setStatisticsEnabled(true);
        config.setDataRegionName("Messages");
         
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
    
    @Bean(name = "allFiles")
    IgniteFileSystem igfsAllFiles(Ignite ignite) {    
        return ignite.fileSystem("userFiles");
    }

}
