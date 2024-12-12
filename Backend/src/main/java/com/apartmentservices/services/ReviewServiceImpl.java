package com.apartmentservices.services;

import com.apartmentservices.dto.request.ReviewCreationRequest;
import com.apartmentservices.dto.response.ReviewResponse;
import com.apartmentservices.dto.response.ReviewSummary;
import com.apartmentservices.dto.response.ReviewSummaryPagination;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.mapper.ReviewMapper;
import com.apartmentservices.models.MainAdvertisement;
import com.apartmentservices.models.Review;
import com.apartmentservices.repositories.MainAdvertisementRepository;
import com.apartmentservices.repositories.ReviewRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    ReviewRepository reviewRepository;
    MainAdvertisementRepository mainAdvertisementRepository;
    ReviewMapper reviewMapper;

    @Transactional
    @Override
    public ReviewResponse createReview(ReviewCreationRequest request) {
        Review review = reviewMapper.toReview(request);
        log.info("Creating review: {}", review);
        try {
            review = reviewRepository.save(review);
            updateAverageRating(review.getAdvertisement().getAdvertisementId());
            return reviewMapper.toReviewResponse(review);
        } catch (Exception e) {
            log.error("Error creating review", e);
            throw new AppException(ErrorCode.REVIEW_CREATION_FAILED);
        }
    }

    @Transactional
    @Override
    public ReviewResponse getReview(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        return reviewMapper.toReviewResponse(review);
    }

    @Transactional
    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deleteReview(Integer reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }
        reviewRepository.deleteById(reviewId);
    }

    @Transactional
    @Override
    public void updateAverageRating(Integer advertisementId) {
        List<Review> reviews = reviewRepository.findByAdvertisement_AdvertisementId(advertisementId);

        if (reviews.isEmpty()) return;

        BigDecimal sumRatings = reviews.stream()
                .map(Review::getRating)
                .map(BigDecimal::valueOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageRating = sumRatings.divide(BigDecimal.valueOf(reviews.size()), 1, BigDecimal.ROUND_HALF_UP);

        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

//        advertisement.setAverageRating(averageRating);

        try {
            mainAdvertisementRepository.save(advertisement);
        } catch (Exception e) {
            log.error("Error updating advertisement average rating", e);
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_UPDATE_FAILED);
        }
    }

//    @Transactional
//    @Override
//    public List<ReviewResponse> getReviewsByAdvertisementId(Integer advertisementId) throws AppException {
//        List<Review> reviews = reviewRepository.findByAdvertisement_AdvertisementId(advertisementId);
//
//        if (reviews.isEmpty()) {
//            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
//        }
//        return reviews.stream()
//                .map(reviewMapper::toReviewResponse)
//                .collect(Collectors.toList());
//    }

    @Transactional
    @Override
    public ReviewSummary getReviewsByAdvertisementId(Integer advertisementId) throws AppException {
        List<Review> reviews = reviewRepository.findByAdvertisementId(advertisementId);

        if (reviews.isEmpty()) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        // Tính toán giá trị trung bình của rating
        BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisementId);

        // Đếm số lượng đánh giá theo từng mức sao
        Long oneStarCount = reviewRepository.countOneStarReviewsByAdvertisementId(advertisementId);
        Long twoStarCount = reviewRepository.countTwoStarReviewsByAdvertisementId(advertisementId);
        Long threeStarCount = reviewRepository.countThreeStarReviewsByAdvertisementId(advertisementId);
        Long fourStarCount = reviewRepository.countFourStarReviewsByAdvertisementId(advertisementId);
        Long fiveStarCount = reviewRepository.countFiveStarReviewsByAdvertisementId(advertisementId);

        // Chuyển đổi Review thành ReviewResponse với khoảng cách thời gian
        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(this::toReviewResponseWithTimeAgo)  // Tính timeAgo trong service
                .collect(Collectors.toList());

        return new ReviewSummary(
                averageRating,
                oneStarCount,
                twoStarCount,
                threeStarCount,
                fourStarCount,
                fiveStarCount,
                reviewResponses
        );
    }

    @Override
    public ReviewSummaryPagination getReviewsByAdvertisementIdWithPagination(Integer advertisementId, int limit, int offset) throws AppException {
        return null;
    }

    @Transactional
    @Override
    public ReviewSummaryPagination getPaginatedReviewsByAdvertisementId(Integer advertisementId, int limit, int offset) throws AppException {
        // Lấy tổng số review trước
        Long totalReviews = reviewRepository.countByAdvertisementId(advertisementId);

        // Lấy danh sách review với phân trang
        List<Review> reviews = reviewRepository.findPaginatedByAdvertisementId(advertisementId, limit, offset);

        if (reviews.isEmpty()) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        // Tính toán các thông tin bổ sung
        BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisementId);
        Long oneStarCount = reviewRepository.countOneStarReviewsByAdvertisementId(advertisementId);
        Long twoStarCount = reviewRepository.countTwoStarReviewsByAdvertisementId(advertisementId);
        Long threeStarCount = reviewRepository.countThreeStarReviewsByAdvertisementId(advertisementId);
        Long fourStarCount = reviewRepository.countFourStarReviewsByAdvertisementId(advertisementId);
        Long fiveStarCount = reviewRepository.countFiveStarReviewsByAdvertisementId(advertisementId);

        // Chuyển đổi Review thành ReviewResponse với khoảng cách thời gian
        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(this::toReviewResponseWithTimeAgo)
                .collect(Collectors.toList());

        // Trả về ReviewSummary bao gồm dữ liệu bổ sung
        return new ReviewSummaryPagination(
                averageRating,
                oneStarCount,
                twoStarCount,
                threeStarCount,
                fourStarCount,
                fiveStarCount,
                totalReviews,
                reviewResponses
        );
    }


    private ReviewResponse toReviewResponseWithTimeAgo(Review review) {
        ReviewResponse response = reviewMapper.toReviewResponse(review);

        // Tính khoảng cách thời gian từ reviewDate đến hiện tại
        String timeAgo = calculateTimeAgo(review.getReviewDate());
        response.setTimeAgo(timeAgo);

        return response;
    }

    private String calculateTimeAgo(LocalDateTime reviewDate) {
        if (reviewDate == null) {
            return "Unknown";
        }

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(reviewDate, now);

        long days = duration.toDays();
        long hours = duration.toHours();
        long minutes = duration.toMinutes();

        if (days > 0) {
            return days + " days ago";
        } else if (hours > 0) {
            return hours + " hours ago";
        } else if (minutes > 0) {
            return minutes + " minutes ago";
        } else {
            return "Just now";
        }
    }

}
