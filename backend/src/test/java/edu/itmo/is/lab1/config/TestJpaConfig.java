package edu.itmo.is.lab1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("test")
@EnableJpaRepositories(basePackages = "edu.itmo.is.lab1.repositories")
public class TestJpaConfig {

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

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource ds) {
        var vendor = new EclipseLinkJpaVendorAdapter();
        vendor.setGenerateDdl(true);
        vendor.setShowSql(false);

        Map<String, Object> props = new HashMap<>();
        props.put("eclipselink.weaving", "false");
        props.put("eclipselink.ddl-generation", "drop-and-create-tables");
        props.put("eclipselink.ddl-generation.output-mode", "database");
        props.put("eclipselink.target-database", "org.eclipse.persistence.platform.database.H2Platform");

        var emf = new LocalContainerEntityManagerFactoryBean();
        emf.setJpaVendorAdapter(vendor);
        emf.setDataSource(ds);
        emf.setPackagesToScan("edu.itmo.is.lab1.entities");
        emf.setJpaPropertyMap(props);
        return emf;
    }

    @Bean
    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean emf) {
        var tx = new JpaTransactionManager();
        tx.setEntityManagerFactory(emf.getObject());
        return tx;
    }
}
