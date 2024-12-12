package com.apartmentservices.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewUpdateRequest {
    private Integer reviewId;
    private Integer rating;
    private String reviewContent;
}
