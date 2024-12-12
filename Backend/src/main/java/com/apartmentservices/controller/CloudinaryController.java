package com.apartmentservices.controller;

import com.apartmentservices.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
@Tag(name = "Cloudinary Controller", description = "APIs for uploading images and videos to Cloudinary / Các API để tải lên hình ảnh và video lên Cloudinary")
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/images")
    @Operation(summary = "Upload Multiple Images", description = "Upload multiple image files to Cloudinary and return their URLs / Tải lên nhiều tệp hình ảnh lên Cloudinary và trả về URL của chúng")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> imageUrls = cloudinaryService.uploadFiles(files);
        return ResponseEntity.ok(imageUrls); // Trả về danh sách URL ảnh sau khi upload thành công
    }

    @PostMapping("/image")
    @Operation(summary = "Upload Image", description = "Upload an image file to Cloudinary and return its URL / Tải lên tệp hình ảnh lên Cloudinary và trả về URL của nó")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = cloudinaryService.uploadFile(file);
        return ResponseEntity.ok(imageUrl); // Trả về URL ảnh sau khi upload thành công
    }

    @PostMapping("/video")
    @Operation(summary = "Upload Video", description = "Upload a video file to Cloudinary and return its URL / Tải lên tệp video lên Cloudinary và trả về URL của nó")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
        // Kiểm tra định dạng video
        if (!file.getContentType().startsWith("video/")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("Chỉ chấp nhận định dạng video");
        }

        // Gọi service để upload video
        String videoUrl = cloudinaryService.uploadVideo(file);
        return ResponseEntity.ok("Video đã được upload thành công: " + videoUrl);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete a file", description = "Delete a file from Cloudinary by publicId / Xóa tệp khỏi Cloudinary dựa trên publicId")
    public ResponseEntity<String> deleteFile(@RequestParam("publicId") String publicId) {
        String result = cloudinaryService.deleteFile(publicId);
        if ("ok".equals(result)) {
            return ResponseEntity.ok("File deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found or already deleted");
        }
    }


//    @PostMapping("/video")
//    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
//        try {
//            // Kiểm tra định dạng video
//            if (!file.getContentType().startsWith("video/")) {
//                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
//                        .body("Chỉ chấp nhận định dạng video");
//            }
//
//            // Upload video lên Cloudinary
//            Map<?, ?> uploadResult = cloudinaryService.uploader().upload(file.getBytes(),
//                    ObjectUtils.asMap(
//                            "resource_type", "video"  // Resource type phải là video
//                    ));
//
//            // Trả về URL của video sau khi upload
//            String videoUrl = (String) uploadResult.get("secure_url");
//            return ResponseEntity.ok("Video đã được upload thành công: " + videoUrl);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Lỗi khi upload video: " + e.getMessage());
//        }
//    }

}