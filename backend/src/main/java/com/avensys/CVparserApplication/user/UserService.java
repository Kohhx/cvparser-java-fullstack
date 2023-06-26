package com.avensys.CVparserApplication.user;

import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import com.avensys.CVparserApplication.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

//    //Create user
//    public void createUser(User newUser){
//    	userRepository.save(newUser);
//    }

    //Read singular user
    public UserResponseDTO getUserById(long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return userToUserResponseDTO(user.get());
        } else {
            throw new ResourceNotFoundException("User with id %s not found".formatted(id));
        }
    }

    //Read list of user
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //Update user
    public void updateUser(User user) {
        userRepository.save(user);
    }

    public UserRoleResponseDTO updateUserRole(long userId, String type) {
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }
        if (type.equals("free")) {
            user.get().setRole("ROLE_FREE");
        } else if (type.equals("paid")) {
            user.get().setRole("ROLE_PAID");
        }
        User updatedUser = userRepository.save(user.get());
        UserRoleResponseDTO userRoleResponse = new UserRoleResponseDTO(updatedUser.getRole());
        return userRoleResponse;
    }

    private UserResponseDTO userToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getResumeLimit(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }


//    //Delete user
//    public void deleteUser(long user_id) {
//    	User user = userRepository.getUserById(user_id);
//    	userRepository.delete(user);
//    }
}
