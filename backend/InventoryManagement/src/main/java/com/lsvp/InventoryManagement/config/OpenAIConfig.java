package com.lsvp.InventoryManagement.config;


import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;

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
                        .description("Documentação da API de gerenciamento de estoque do LSVP"))
                    .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                            .type(Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            ))
                    .addSecurityItem(new SecurityRequirement().addList("BearerAuth"));
    }
}
