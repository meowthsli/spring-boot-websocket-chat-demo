package org.wolna.ouchatserver;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.wolna.ouchatserver.controller.RegistrationData;
import org.wolna.ouchatserver.security.LoginCredentials;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = {"classpath:/test.properties"})
public class RestApiTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

	@Test
	public void contextLoads() {
	}

    @Before
    public void setupAll() {
        RegistrationData reg = new RegistrationData();
        reg.setEmail("hello@1.org");
        reg.setPassword("pass1");
        reg.setName("Ivan ivanov");
        reg.setConfirmPassword(reg.getPassword());
        ResponseEntity<String> reReg = restTemplate.postForEntity("http://localhost:" + port + "/api/register", reg, String.class);
        assertThat(HttpStatus.OK.equals(reReg.getStatusCode()));
    }

    @Test
    public void testRegisterUser() {
        
        LoginCredentials lc = new LoginCredentials();
        lc.setEmail("hello@1.org");
        lc.setPassword("pass1");
        ResponseEntity<String> reLogin = restTemplate.postForEntity("http://localhost:" + port + "/api/login", lc, String.class);
        assertThat(HttpStatus.OK.equals(reLogin.getStatusCode()));

        assertThat(reLogin.getHeaders().containsKey("Authorization"));
        String token = reLogin.getHeaders().get("Authorization").get(0);
        assertThat(token.startsWith("JWT "));

    }

    @Test
    public void testRegisterUser2() {

        LoginCredentials lc = new LoginCredentials();
        lc.setEmail("hello@1.org");
        lc.setPassword("pass1");
        ResponseEntity<String> reLogin = restTemplate.postForEntity("http://localhost:" + port + "/api/login", lc, String.class);
        assertThat(HttpStatus.OK.equals(reLogin.getStatusCode()));

        assertThat(reLogin.getHeaders().containsKey("Authorization"));
        String token = reLogin.getHeaders().get("Authorization").get(0);
        assertThat(token.startsWith("JWT "));

    }
}
