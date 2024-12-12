package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.ReviewCreationRequest;
import com.apartmentservices.dto.response.ReviewResponse;
import com.apartmentservices.models.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "advertisement.advertisementId", source = "advertisementId") // Gán advertisementId
    @Mapping(target = "user.userId", source = "userId") // Gán userId
    Review toReview(ReviewCreationRequest request);

    @Mapping(source = "user.userId", target = "user.id")
    @Mapping(source = "advertisement.advertisementId", target = "advertisementId") // Gán advertisementId cho phản hồi
    ReviewResponse toReviewResponse(Review review);
}
