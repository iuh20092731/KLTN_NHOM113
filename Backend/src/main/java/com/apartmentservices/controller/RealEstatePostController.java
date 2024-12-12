package com.apartmentservices.controller;

import com.apartmentservices.dto.request.RealEstatePostCreationRequest;
import com.apartmentservices.dto.request.RealEstatePostUpdateRequest;
import com.apartmentservices.dto.response.PaginatedResponse;
import com.apartmentservices.dto.response.PostViewResponse;
import com.apartmentservices.dto.response.RealEstatePostResponse;
import com.apartmentservices.services.RealEstatePostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/real-estate-posts")
@RequiredArgsConstructor
@Tag(name = "Real Estate Post Controller", description = "APIs for managing real estate posts / Các API để quản lý bài đăng bất động sản")
public class RealEstatePostController {

    private final RealEstatePostService realEstatePostService;

    @PostMapping
    @Operation(summary = "Create Real Estate Post", description = "Create a new real estate post / Tạo một bài đăng bất động sản mới")
    public ResponseEntity<RealEstatePostResponse> createPost(@RequestBody RealEstatePostCreationRequest request) {
        RealEstatePostResponse response = realEstatePostService.createPost(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get Real Estate Post", description = "Get a real estate post by its ID / Lấy một bài đăng bất động sản theo ID của nó")
    public ResponseEntity<RealEstatePostResponse> getPost(@PathVariable("postId") Integer postId) {
        RealEstatePostResponse response = realEstatePostService.getPostById(postId);
        return ResponseEntity.ok(response);
    }

//    @GetMapping
//    @Operation(summary = "Get All Real Estate Posts", description = "Retrieve a list of all real estate posts / Lấy danh sách tất cả các bài đăng bất động sản")
//    public ResponseEntity<List<RealEstatePostResponse>> getAllPosts() {
//        List<RealEstatePostResponse> responses = realEstatePostService.getAllPosts();
//        return ResponseEntity.ok(responses);
//    }

    @GetMapping()
    @Operation(summary = "Get Paginated Real Estate Posts", description = "Retrieve a paginated list of real estate posts / Lấy danh sách bài đăng bất động sản theo phân trang")
    public ResponseEntity<PaginatedResponse> getPaginatedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        PaginatedResponse response = realEstatePostService.getPaginatedPosts(page, size);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete Real Estate Post", description = "Delete a real estate post by its ID / Xóa một bài đăng bất động sản theo ID của nó")
    public ResponseEntity<Void> deletePost(@PathVariable("postId") Integer postId) {
        realEstatePostService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/increase-views")
    @Operation(summary = "Increase Views for Multiple Posts", description = "Increase the view count for a list of posts and return the updated views / Tăng số lượt xem cho danh sách các bài đăng và trả về số lượt xem cập nhật")
    public ResponseEntity<List<PostViewResponse>> increaseViews(@RequestBody List<Integer> postIds) {
        List<PostViewResponse> response = realEstatePostService.increaseViews(postIds);
        return ResponseEntity.ok(response);
    }

}
