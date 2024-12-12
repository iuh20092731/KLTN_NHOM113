package com.apartmentservices.controller;

import com.apartmentservices.dto.request.ReviewCreationRequest;
import com.apartmentservices.dto.request.ReviewUpdateRequest;
import com.apartmentservices.dto.response.ReviewResponse;
import com.apartmentservices.dto.response.ReviewSummary;
import com.apartmentservices.dto.response.ReviewSummaryPagination;
import com.apartmentservices.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Review Controller", description = "APIs for managing reviews / Các API để quản lý đánh giá")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Create Review", description = "Create a new review / Tạo một đánh giá mới")
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewCreationRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Review", description = "Get a review by its ID / Lấy một đánh giá theo ID của nó")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable("id") Integer reviewId) {
        ReviewResponse response = reviewService.getReview(reviewId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get All Reviews", description = "Retrieve a list of all reviews / Lấy danh sách tất cả các đánh giá")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> responses = reviewService.getAllReviews();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/advertisement/{advertisementId}")
    @Operation(summary = "Get Reviews by Advertisement ID", description = "Get reviews for a specific advertisement by its ID / Lấy các đánh giá cho một quảng cáo cụ thể theo ID của nó")
    public ResponseEntity<ReviewSummary> getReviewsByAdvertisementId(@PathVariable Integer advertisementId) {
        ReviewSummary reviewSummary = reviewService.getReviewsByAdvertisementId(advertisementId);
        return ResponseEntity.ok(reviewSummary);
    }

    @GetMapping("/advertisement")
    @Operation(summary = "Get Paginated Reviews by Advertisement ID", description = "Get paginated reviews for a specific advertisement / Lấy các đánh giá phân trang cho một quảng cáo cụ thể")
    public ResponseEntity<ReviewSummaryPagination> getReviewsByAdvertisementId(
            @RequestParam Integer advertisementId,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        ReviewSummaryPagination reviewSummary = reviewService.getPaginatedReviewsByAdvertisementId(advertisementId, limit, offset);
        return ResponseEntity.ok(reviewSummary);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Review", description = "Delete a review by its ID / Xóa một đánh giá theo ID của nó")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Integer reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    @Operation(summary = "Update Review", description = "Update an existing review / Cập nhật một đánh giá hiện có")
    public ResponseEntity<ReviewResponse> updateReview(@RequestBody ReviewUpdateRequest request) {
        // Assuming you have a method in ReviewService to handle this
        throw new UnsupportedOperationException("Update method not implemented yet");
    }
}
