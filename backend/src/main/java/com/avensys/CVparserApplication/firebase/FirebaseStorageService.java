package com.avensys.CVparserApplication.firebase;

import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FirebaseStorageService {

    @Value("${firebase.storage.bucket}")
    String fbStorageBucket;
    Storage storage = StorageOptions.getDefaultInstance().getService();

    public String uploadFile(MultipartFile file, String fileName, String fileExt) {

        // Define the bucket name and file path in Firebase Storage
        UUID uuid = UUID.randomUUID();
        String bucketName = fbStorageBucket;
        String filePath = "resume/" + fileName + uuid + fileExt;

        BlobId blobId = BlobId.of(bucketName, filePath);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        // Upload the file to Firebase Storage
        try {
            Blob blob = storage.create(blobInfo, file.getBytes());
            return blob.getName();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteFile(String filePath) {
        // Get a reference to the file in Firebase Storage
        BlobId blobId = BlobId.of(fbStorageBucket, filePath);
        Blob blob = storage.get(blobId);

        // Delete the file from Firebase Storage
        blob.delete();
    }
}
