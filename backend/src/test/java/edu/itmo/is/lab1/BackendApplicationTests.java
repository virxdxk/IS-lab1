package edu.itmo.is.lab1;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = App.class)
@ActiveProfiles("test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // smoke-test: просто проверяем, что контекст поднимается
    }
}
