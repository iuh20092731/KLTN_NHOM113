package com.apartmentservices.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class ReviewSummary {
    private BigDecimal averageRating;
    private Long oneStarCount;
    private Long twoStarCount;
    private Long threeStarCount;
    private Long fourStarCount;
    private Long fiveStarCount;
    private List<ReviewResponse> reviews;
}
