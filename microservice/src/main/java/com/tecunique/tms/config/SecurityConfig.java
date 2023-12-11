package com.tecunique.tms.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired
  private final UserDetailsService userDetailsService;

  @Bean
  protected AuthenticationProvider authProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());

    return provider;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf()
        .disable()
        .headers()
        .frameOptions()
        .sameOrigin() // Allow the H2 console to be displayed in an iframe from the same origin
        .and()
        .authorizeHttpRequests(
            (request) -> request
                .requestMatchers("/h2-console/**")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/user/")
                .permitAll()
                .requestMatchers("/candidates/**", "/interview/**", "/roles/**")
                .authenticated()
                .anyRequest()
                .authenticated())
        .formLogin()
        .and()
        .logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/"));

    return http.build();
  }

  // @Bean
  // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  //   http.authorizeHttpRequests(
  //       authorize -> authorize
  //           .requestMatchers("/h2-console/**")
  //           .anonymous()
  //           .anyRequest()
  //           .authenticated())
  //       .httpBasic(withDefaults())
  //       .csrf(csrf -> csrf.disable())
  //       .headers(headers -> headers.frameOptions().sameOrigin());
  //   return http.build();
  // }
}
