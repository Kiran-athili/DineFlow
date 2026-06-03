package com.dineflow.backend.config;

import org.springframework.web.cors.CorsConfigurationSource;
import com.dineflow.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Public auth APIs
                        .requestMatchers("/api/auth/register-customer").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()

                        // Authenticated auth APIs
                        .requestMatchers("/api/auth/profile").authenticated()
                        .requestMatchers("/api/auth/change-password").authenticated()
                        .requestMatchers("/api/auth/admin/**").authenticated()

                        // Public APIs
                        .requestMatchers("/api/test/health").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menu-categories/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menu-items/available").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menu-items/available/category/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tables/available").permitAll()

                        // Admin APIs that were already working
                        .requestMatchers("/api/test/roles").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/files/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/menu-categories/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/menu-items/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/tables/**").hasAuthority("ROLE_ADMIN")

                        // Orders and payments: authenticated here, role checked in controllers
                        .requestMatchers("/api/orders").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/payments").authenticated()
                        .requestMatchers("/api/payments/**").authenticated()

                        .requestMatchers("/api/dashboard/**").authenticated()
                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}