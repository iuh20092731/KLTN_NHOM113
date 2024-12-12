package com.apartmentservices.configuration;

import com.apartmentservices.models.User;
import com.apartmentservices.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.util.Map;
import java.util.Optional;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {
    @Autowired
    private UserService userService;

    private final String[] PUBLIC_ENDPOINTS = {
        "/api/v1/users", "/api/v1/auth/token", "/api/v1/auth/introspect", "/api/v1/auth/logout", "/api/v1/auth/refresh"
            ,"/api/v1/categories", "api/v1/upload/image", "api/v1/upload/video",
            "/swagger-ui/**", "/v3/api-docs/**",
            "/api/v1/comments/**", "/api/v1/comments/*/replies", "/api/v1/comments/*",
            "/api/v1/search", "api/v1/users/create", "api/v1/users/verify-account", "api/v1/users/resend-otp",
            "/login/oauth2/code/google", "/login/oauth2/code/facebook", "/login/oauth2/code/github",
            "/api/v1/auth/login", "/api/v1/auth/login-success", "/api/v1/auth/login-failure",
            "/oauth2/authorization/google", "/api/v1/users/login-with-google",
            "/api/v1/real-estate-posts", "/api/v1/real-estate-posts/*", "/api/v1/real-estate-posts/**",
            "/api/v1/real-estate-posts/increase-views",
            "/api/v1/questions", "/api/v1/questions/*", "/api/v1/questions/*/likes",
            "/api/v1/comments", "/api/v1/comments/*", "api/v1/comments/*/replies", "api/v1/comments/**"

            ,
    };

    private final String[] PUBLIC_GET_ENDPOINTS = {
            "/api/v1/categories", "/api/v1/categories/*",
            "/api/v1/advertisement-services", "/api/v1/advertisement-services/*", "/api/v1/advertisement-services/category/*",
            "/api/v1/advertisement-service-media",
            "/api/v1/main-advertisements", "/api/v1/main-advertisements/*","/api/v1/main-advertisements/*/like",
            "/api/v1/main-advertisements/service/*",
            "/api/v1/reviews", "/api/v1/reviews/*",
            "/api/v1/reviews/advertisement", "/api/v1/reviews/advertisement/*",
            "/api/v1/review-media", "/api/v1/review-media/*",
            "/api/v1/faqs", "/api/v1/faqs/*",
            "/api/v1/faqs/advertisement/*",
            "/api/v1/advertisement-media", "/api/v1/advertisement-media/*","/api/v1/advertisement-media/advertisement/*",
            "/api/v2/main-advertisements/service",
            "/api/v2/main-advertisements/*",
            "/api/v2/main-advertisements/top-best", "/api/v2/main-advertisements/top-best/*",
            "/api/v2/main-advertisements/top-popular/*", "/api/v2/main-advertisements/top-popular/*",
            "/api/v2/main-advertisements/service/*",
            "/api/v2/main-advertisements/top-bests", "/api/v2/main-advertisements/top-populars",
            "/api/v1/web-visits/*",
            "/api/v1/info/*",
            "/api/v1/info/districts", "/api/v1/info/districts/*/wards",
            "/swagger-ui/**", "/v3/api-docs/**",
            "/api/v1/click-tracking", "/api/v1/click-tracking/all", "/api/v1/click-tracking/*",
            "/api/v1/users/advertisers/search",
            "/api/v1/auth/login",
            "/api/v1/real-estate-posts",
            "/api/v1/banners", "/api/v1/banners/*", "/api/v1/banners/type/*", "/api/v1/banners/type/*/seq/*",
            "api/v1/favorite-advertisements", "api/v1/favorite-advertisements/*",
            "/api/v1/real-estate-listings", "/api/v1/real-estate-listings/*", "/api/v1/real-estate-listings/**",
            "api/v2/advertisement-services/category", "api/v2/advertisement-services/category/*",
            "/api/v1/social-group-links", "/api/v1/social-group-links/*",
            "/api/v1/comments", "/api/v1/comments/*",
            "/api/v1/questions", "/api/v1/questions/*", "/api/v1/questions/*/likes"



            ,
    };

    private final String[] PUBLIC_PUT_ENDPOINTS = {
            "/api/v1/main-advertisements/*/like",
            "/api/v1/main-advertisements/*/click",
            "/api/v1/main-advertisements/*/share",
            "/api/v1/main-advertisements/*/save",
            "/api/v1/questions/*/likes",
    };


    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.PUT, PUBLIC_PUT_ENDPOINTS).permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**", "/api/v1/auth/login", "/api/v1/auth/login-success").permitAll()
                .anyRequest()
                .authenticated());


        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()))
                .oauth2Login(oauth2 -> oauth2
                                .successHandler(oauth2SuccessHandler()) // Sử dụng custom success handler
                                .failureUrl("/api/v1/auth/login-failure")
                )
        ;
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.addAllowedOrigin("https://dichvuhungngan.com");
        corsConfiguration.addAllowedOrigin("https://www.dichvuhungngan.com");
        corsConfiguration.addAllowedOrigin("http://localhost:5173");
        corsConfiguration.addAllowedOrigin("http://localhost:3000");
        corsConfiguration.addAllowedOrigin("http://localhost:8080");
        corsConfiguration.addAllowedOrigin("https://admin.dichvuhungngan.com");
        corsConfiguration.addAllowedOrigin("https://www.tranquanghuyit09.website");
        corsConfiguration.addAllowedOrigin("https://tranquanghuyit09.website");
        corsConfiguration.addAllowedOrigin("https://apartment-services-dev.vercel.app");
        corsConfiguration.addAllowedOrigin("https://accounts.google.com");
//        corsConfiguration.setAllowCredentials(true);
//        corsConfiguration.addAllowedOrigin("*");
//        corsConfiguration.addAllowedMethod("*");
//        corsConfiguration.addAllowedHeader("*");

        corsConfiguration.setAllowCredentials(true); // Cho phép cookie
        corsConfiguration.addAllowedMethod("*"); // Cho phép tất cả các phương thức HTTP
        corsConfiguration.addAllowedHeader("*"); // Cho phép tất cả các header

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

//    @Bean
//    public AuthenticationSuccessHandler oauth2SuccessHandler() {
//        return (request, response, authentication) -> {
//            try {
//                OAuth2User user = ((OAuth2AuthenticationToken) authentication).getPrincipal();
//                Map<String, Object> attributes = user.getAttributes();
//                Optional<User> savedUser = userService.saveUserFromGoogle(attributes);
//
//                response.setContentType("application/json");
//                response.setStatus(HttpServletResponse.SC_OK);
//
//                String jsonResponse = "{\"message\": \"Login successful\", \"userId\": \"" +
//                        savedUser.map(User::getUserId).orElse("unknown") +
//                        "\", \"result\": " + (savedUser.isPresent() ? "true" : "false") + "}";
//
//                response.getWriter().write(jsonResponse);
//                response.getWriter().flush();
//            } catch (Exception e) {
//                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//                String errorResponse = "{\"message\": \"An error occurred during login\"}";
//                response.getWriter().write(errorResponse);
//                response.getWriter().flush();
//            }
//        };
//    }

    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (request, response, authentication) -> {
            try {
                // Xử lý OAuth2User
                OAuth2User user = ((OAuth2AuthenticationToken) authentication).getPrincipal();
                Map<String, Object> attributes = user.getAttributes();
//                Optional<User> savedUser = userService.saveUserFromGoogle(attributes);

                // Lấy redirect_uri từ tham số truy vấn
                String redirectUri = request.getParameter("redirect_uri");
                log.info("Redirect URI: " + redirectUri);
//                if (redirectUri != null && !redirectUri.isEmpty()) {
//                    response.sendRedirect(redirectUri); // Chuyển hướng đến URL đã lưu
//                    return;
//                }
                if (1==1) {
                    response.sendRedirect("https://www.dichvuhungngan.com/"); // Chuyển hướng đến URL đã lưu
                    return;
                }

                // Phản hồi JSON nếu không có redirect_uri
//                response.setContentType("application/json");
//                response.setStatus(HttpServletResponse.SC_OK);
//                String jsonResponse = "{\"message\": \"Login successful\", \"userId\": \"" +
//                        savedUser.map(User::getUserId).orElse("unknown") +
//                        "\", \"result\": " + (savedUser.isPresent() ? "true" : "false") + "}";
//                response.getWriter().write(jsonResponse);
//                response.getWriter().flush();
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                String errorResponse = "{\"message\": \"An error occurred during login\"}";
                response.getWriter().write(errorResponse);
                response.getWriter().flush();
            }
        };
    }




}
