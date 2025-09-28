package edu.itmo.is.lab1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("!test")
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "edu.itmo.is.lab1.repositories")
public class JpaConfig {

    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        // Свяжет spring.datasource.* из env/application.properties c пулом Hikari
        return DataSourceBuilder.create()
                .type(com.zaxxer.hikari.HikariDataSource.class)
                .build();
    }

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource ds) {
        var vendor = new EclipseLinkJpaVendorAdapter();
        vendor.setGenerateDdl(false);
        vendor.setShowSql(true);

        Map<String, Object> props = new HashMap<>();
        props.put("eclipselink.weaving", "false");
        props.put("eclipselink.ddl-generation", "none");
        props.put("eclipselink.target-database", "org.eclipse.persistence.platform.database.PostgreSQLPlatform");

        var emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(ds);
        emf.setJpaVendorAdapter(vendor);
        emf.setPackagesToScan("edu.itmo.is.lab1.entities");
        emf.setJpaPropertyMap(props);
        return emf;
    }

    @Bean
    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean emf) {
        return new JpaTransactionManager(emf.getObject());
    }
}
