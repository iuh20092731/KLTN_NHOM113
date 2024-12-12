package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.RealEstatePostCreationRequest;
import com.apartmentservices.dto.request.RealEstatePostUpdateRequest;
import com.apartmentservices.dto.response.RealEstatePostResponse;
import com.apartmentservices.models.RealEstatePost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RealEstatePostMapper {

    @Mapping(target = "contactPhoneNumber", source = "contactPhoneNumber")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "isAnonymous", source = "isAnonymous")
    RealEstatePost toRealEstatePost(RealEstatePostCreationRequest request);

    @Mapping(target = "postId", source = "postId")
    @Mapping(target = "postType", source = "postType")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "contactPhoneNumber", source = "contactPhoneNumber")
    @Mapping(target = "isAnonymous", source = "isAnonymous")
    @Mapping(target = "createdAt", source = "createdAt")
    RealEstatePostResponse toRealEstatePostResponse(RealEstatePost post);

//    @Mapping(target = "id", source = "postId")
    RealEstatePostResponse toRealEstatePostResponseForDetail(RealEstatePost post);

    void updateRealEstatePost(@MappingTarget RealEstatePost post, RealEstatePostUpdateRequest request);
}
