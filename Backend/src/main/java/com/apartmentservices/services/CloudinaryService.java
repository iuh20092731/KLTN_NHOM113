package com.apartmentservices.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString(); // Trả về URL ảnh đã upload
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public String uploadVideo(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "video")); // Resource type phải là video
            return uploadResult.get("secure_url").toString(); // Trả về URL video đã upload
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload video", e);
        }
    }

    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                urls.add(uploadResult.get("url").toString()); // Thêm URL của từng ảnh vào danh sách
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename(), e);
            }
        }
        return urls; // Trả về danh sách các URL ảnh đã upload
    }

    public String deleteFile(String publicId) {
        try {
            Map<?, ?> deleteResult = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return deleteResult.get("result").toString(); // Trả về kết quả (e.g., "ok" nếu xóa thành công)
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + publicId, e);
        }
    }

}
