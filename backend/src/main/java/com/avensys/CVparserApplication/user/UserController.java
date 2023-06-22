package com.avensys.CVparserApplication.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;

@RestController
public class UserController {

	@Autowired
	UserService userService;
	
    //=============================================================
    //No. 3 and 4, Get/Patch
	// " /users/id "
	//PreAuthorize - n/a
	
	//Upload Page (#3 - Get)
	@GetMapping("/users/{id}")
	public ResponseEntity<User> GetUserForUpload (@PathVariable long id){
		User user = userService.getUserById(id);
		if(user != null) {
			return new ResponseEntity<>(user,HttpStatus.OK);
		}
		return new ResponseEntity<>(null,HttpStatus.UNAUTHORIZED);
		
	}
	
	//Upload Page (#4 - Patch)
	//Overwrites the following
	//	1. Role (Free -> Paid)
	@PatchMapping("/users/{id}")
	public ResponseEntity<UserRoleResponseDTO> PatchUserRoleForUpload 
	(@PathVariable long id){
			UserRoleResponseDTO userResponse = userService.updateUserRole(id);
			return new ResponseEntity<>(userResponse,HttpStatus.OK);
	}
}
