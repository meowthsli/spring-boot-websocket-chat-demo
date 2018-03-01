package org.wolna.ouchatserver;

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
}
