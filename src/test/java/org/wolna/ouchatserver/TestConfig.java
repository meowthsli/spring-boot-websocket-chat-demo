package org.wolna.ouchatserver;

import java.nio.file.Paths;
import org.apache.ignite.Ignite;
import org.apache.ignite.Ignition;
import org.apache.ignite.configuration.DataRegionConfiguration;
import org.apache.ignite.configuration.DataStorageConfiguration;
import org.apache.ignite.configuration.IgniteConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author yurij
 */
@Configuration
public class TestConfig {
    static {
        System.setProperty("IGNITE_PERFORMANCE_SUGGESTIONS_DISABLED", Boolean.toString(true));
        System.setProperty("IGNITE_QUIET", Boolean.toString(false));
    }
    
    @Bean
    public Ignite ignite() {
        IgniteConfiguration config = new IgniteConfiguration();
        config.setClientMode(false);
        config.setClassLoader(this.getClass().getClassLoader());
        config.setPeerClassLoadingEnabled(false);
        
        DataStorageConfiguration dscfg = new DataStorageConfiguration();
        DataRegionConfiguration drcfg = new DataRegionConfiguration();
        drcfg.setPersistenceEnabled(true);
        dscfg.setDefaultDataRegionConfiguration(drcfg);
       
        String cwd = Paths.get("").toAbsolutePath().toString();
        dscfg.setStoragePath(cwd + "/target/ignite/data");
        dscfg.setWalPath(cwd + "/target/ignite/wal");
        
        config.setDataStorageConfiguration(dscfg);

        Ignite i = Ignition.start(config);
        i.active(true);
        return i;
    }
}
