package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewSummaryPagination {
    BigDecimal averageRating;
    Long oneStarCount;
    Long twoStarCount;
    Long threeStarCount;
    Long fourStarCount;
    Long fiveStarCount;
    Long totalReviews;  // Tổng số review
    List<ReviewResponse> reviews;  // Danh sách các review
}
