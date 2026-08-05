package io.everyonecodes.pbltest.config;

import io.everyonecodes.pbltest.model.JwtAuthenticationFilter;
import io.everyonecodes.pbltest.service.CustomUserDetailsService;
import io.everyonecodes.pbltest.service.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final PasswordEncoder passwordEncoder;
    private CustomUserDetailsService myUserDetailsService;


    public SecurityConfig(@Lazy PasswordEncoder passwordEncoder, CustomUserDetailsService myUserDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.myUserDetailsService = myUserDetailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(myUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        return httpSecurity
                // 1. Obsługa CORS
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new CorsConfiguration();
                    corsConfig.setAllowedOriginPatterns(List.of("*"));
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                // 2. Wyłączamy CSRF (przy JWT i REST API jest zbędne)
                .csrf(AbstractHttpConfigurer::disable)
                // 3. Określamy dostęp do endpointów
                .authorizeHttpRequests(registry -> registry
                        // Publiczne endpointy autentykacji (np. /api/auth/login, /api/auth/register)
                        .requestMatchers("/api/**", "/error").permitAll()
                        // Publiczne zasoby statyczne (jeśli serwujesz widoki HTML/pliki)
                        .requestMatchers("/ms-native","/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()
                        // Wszystkie pozostałe żądania wymagają tokena JWT
                        .anyRequest().authenticated()
                )
                // 4. Bezstanowość (brak sesji na serwerze)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 5. Wpięcie filtra JWT przed domyślnym filtrem Springa
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
//    object storage s3
}
