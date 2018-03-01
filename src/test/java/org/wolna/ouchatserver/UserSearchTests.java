package org.wolna.ouchatserver;

import java.util.List;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.wolna.ouchatserver.model.Conversations;

/**
 *
 * @author yurij
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = {"classpath:/test.properties"})
public class UserSearchTests {
    @Autowired
    Conversations convs;
    
    @Test @Ignore
    public void test() {
        List<String> ids = convs.search("FIO");
    }
}
