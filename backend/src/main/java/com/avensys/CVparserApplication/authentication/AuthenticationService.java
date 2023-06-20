package com.avensys.CVparserApplication.authentication;

import com.avensys.CVparserApplication.exceptions.DuplicateResourceException;
import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import com.avensys.CVparserApplication.jwt.JwtService;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRegistrationRequestDTO;
import com.avensys.CVparserApplication.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User registerUser(UserRegistrationRequestDTO userRegistration) {
        if (userRepository.existsByEmail(userRegistration.email())) {
            throw new DuplicateResourceException("Email already exist!");
        }
        System.out.println(userRegistration.password());
        User user = new User();
        user.setEmail(userRegistration.email());
        user.setPassword(passwordEncoder.encode(userRegistration.password()));
        user.setFirstName(userRegistration.firstName());
        user.setLastName(userRegistration.lastName());
        user.setRole(userRegistration.role());


        User userSaved = userRepository.save(user);
        return userSaved;
    }

    public String getUserRole(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }
        return user.get().getRole();
    }

    public AuthenticationResponseDTO getUserAuthResponse(String email, String message) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }
        String token = jwtService.generateToken(user.get().getEmail());
        return new AuthenticationResponseDTO(
                user.get().getId(),
                message,
                user.get().getEmail(),
                token,
                user.get().getRole());
    }

}
