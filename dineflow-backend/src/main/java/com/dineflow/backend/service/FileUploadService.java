package com.dineflow.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

    private static final String BASE_UPLOAD_DIR = "uploads";

    public String uploadFile(MultipartFile file, String folderName) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (!folderName.equals("categories") &&
                !folderName.equals("menu") &&
                !folderName.equals("banners")) {
            throw new RuntimeException("Invalid upload folder");
        }

        try {
            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                throw new RuntimeException("Invalid file name");
            }

            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String newFileName = UUID.randomUUID() + fileExtension;

            Path uploadPath = Paths.get(BASE_UPLOAD_DIR, folderName);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(newFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + folderName + "/" + newFileName;

        } catch (IOException e) {
            throw new RuntimeException("File upload failed");
        }
    }
}