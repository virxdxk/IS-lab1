package edu.itmo.is.lab1.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@TestConfiguration
@Profile("test")
public class TestDsConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        var ds = new DriverManagerDataSource();
        ds.setDriverClassName("org.h2.Driver");
        ds.setUrl("jdbc:h2:mem:islab1;MODE=PostgreSQL;DATABASE_TO_UPPER=false;DB_CLOSE_DELAY=-1;INIT=CREATE SCHEMA IF NOT EXISTS public");
        ds.setUsername("sa");
        ds.setPassword("");
        return ds;
    }
}
