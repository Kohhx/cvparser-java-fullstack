package com.avensys.CVparserApplication.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;

@Component
public class FirebaseInitializer {

	private static boolean firebaseInitialized = false;
	
    public void initializeFirebase() {
        try {
            if(firebaseInitialized) {
	        	FileInputStream serviceAccount = new FileInputStream("src/main/resources/firebaseservice.json");
	            System.out.println("Run firebase initializer");
	            FirebaseOptions options = new FirebaseOptions.Builder()
	                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
	                    .build();
	
	            FirebaseApp.initializeApp(options,"[DEFAULT]");
	            firebaseInitialized = true;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
