package com.lsvp.InventoryManagement.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {

    @Bean
    public OpenAPI customAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("API - Inventory Management System")
                        .version("1.0")
                        .description("Documentação da API de gerenciamento de estoque do LSVP"));
    }
}
