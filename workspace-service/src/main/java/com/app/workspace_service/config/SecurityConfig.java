package com.app.workspace_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.app.workspace_service.security.JwtFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    
        private final JwtFilter jwtFilter;

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/auth/**",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                    "/ping"
            ).permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);   

    return http.build();
}
}
