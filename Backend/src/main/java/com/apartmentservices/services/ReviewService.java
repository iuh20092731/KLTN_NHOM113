package com.apartmentservices.services;

import com.apartmentservices.dto.request.ReviewCreationRequest;
import com.apartmentservices.dto.response.ReviewResponse;
import com.apartmentservices.dto.response.ReviewSummary;
import com.apartmentservices.dto.response.ReviewSummaryPagination;
import com.apartmentservices.exception.AppException;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(ReviewCreationRequest request) throws AppException;

    ReviewResponse getReview(Integer reviewId) throws AppException;

    List<ReviewResponse> getAllReviews() throws AppException;

    void deleteReview(Integer reviewId) throws AppException;

    void updateAverageRating(Integer advertisementId) throws AppException;

//    List<ReviewResponse> getReviewsByAdvertisementId(Integer advertisementId) throws AppException;
    ReviewSummary getReviewsByAdvertisementId(Integer advertisementId) throws AppException;

    ReviewSummaryPagination getReviewsByAdvertisementIdWithPagination(Integer advertisementId, int limit, int offset) throws AppException;

    ReviewSummaryPagination getPaginatedReviewsByAdvertisementId(Integer advertisementId, int limit, int offset) throws AppException;
}
