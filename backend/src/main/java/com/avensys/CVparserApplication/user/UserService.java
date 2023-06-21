package com.avensys.CVparserApplication.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    
    //=============================================================
    //User Service 
    
    //Create user
    public void createUser(User newUser){
    	userRepository.save(newUser);
    }
    
    //Read singular user
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    //Read list of user
    public List<User> getAllUsers(){
    	return (List<User>) userRepository.findAll();
    }

    //Update user
    public void updateUser(User user) {
    	userRepository.save(user);
    }
    
    //Delete user
    public void deleteUser(int user_id) {
    	userRepository.deleteById((long)user_id);
    }
}
