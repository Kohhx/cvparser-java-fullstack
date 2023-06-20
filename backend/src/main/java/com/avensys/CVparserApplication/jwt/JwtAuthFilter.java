package com.avensys.CVparserApplication.jwt;

import com.avensys.CVparserApplication.authentication.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Get the "Bearer xxxx" token from "Authorization" in the incoming request
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        // Check if the auth header is not null and start with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract out only the token from the entire auth header
            token = authHeader.substring(7);
            // Extract out the username from the token using JWT service
            username = jwtService.extractUsername(token);
        }

        // Check if username exist and if there are existing authToken in the security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null ){
            // Load in the username to our userdetailservice bean we created to get back the userdetails
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // validate the toke with the userdetails
            if ( jwtService.validateToken(token, userDetails)){
                // Create a new usernamepassword token and set it in webAuth
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                        null,
                        userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set token in the security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }

        // Pass on the request and response
        filterChain.doFilter(request, response);
    }
}
