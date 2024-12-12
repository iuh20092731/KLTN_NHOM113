package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {

    Integer reviewId;
    Integer rating;
    String reviewContent;
    LocalDateTime reviewDate;
    String timeAgo;
    UserResponse user;
    Integer advertisementId;
}
