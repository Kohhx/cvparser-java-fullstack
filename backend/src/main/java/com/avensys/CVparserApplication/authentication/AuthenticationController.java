package com.avensys.CVparserApplication.authentication;

import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import com.avensys.CVparserApplication.jwt.JwtService;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRegistrationRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationController(AuthenticationService authenticationService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("signup")
    public ResponseEntity<AuthenticationResponseDTO> signup(@RequestBody UserRegistrationRequestDTO userRegistration) {
        User user = authenticationService.registerUser(userRegistration);
        String token = jwtService.generateToken(user.getEmail());
        return new ResponseEntity<>(new AuthenticationResponseDTO(
                user.getId(),
                "Account has been registered",
                user.getEmail(),
                token,
                user.getRole()),
                HttpStatus.CREATED);
    }

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponseDTO> authenticateAndGetToken(@RequestBody AuthLoginRequestDTO authRequest) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(),
                        authRequest.getPassword()));

        if (authentication.isAuthenticated()) {
            AuthenticationResponseDTO responseDTO = authenticationService.getUserAuthResponse(authRequest.getEmail(), "Login successfully");
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            throw new ResourceNotFoundException("Invalid user request");
        }
    }

    // This route require basic auth, Both USER AND ADMIN CAN
    @GetMapping("/")
    public String helloWorld() {
        return "Hello World";
    }

    // This route require basic auth, Only ADMIN can access
    @GetMapping("/message")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String getMessage() {
        return "Hey, Admin";
    }


}
