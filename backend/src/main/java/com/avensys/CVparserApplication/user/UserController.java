package com.avensys.CVparserApplication.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	UserService userService;
	
    //=============================================================
    //No. 3 and 4, Get/Patch
	// " /users/id "
	//PreAuthorize - n/a
	
	//Upload Page (#3 - Get)
	@GetMapping("/users/{id}")
	@PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
	public ResponseEntity<UserResponseDTO> GetUserForUpload (@PathVariable long id){
		UserResponseDTO user = userService.getUserById(id);
		return new ResponseEntity<UserResponseDTO>(user,HttpStatus.OK);
	}
	
	//Upload Page (#4 - Patch)
	//Overwrites the following
	//	1. Role (Free -> Paid)
	@PatchMapping("users/{id}")
	@PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
	public ResponseEntity<UserRoleResponseDTO> PatchUserRole
	(@PathVariable long id, @RequestParam String type){
			UserRoleResponseDTO userResponse = userService.updateUserRole(id,type);
			return new ResponseEntity<>(userResponse,HttpStatus.OK);
	}


}
