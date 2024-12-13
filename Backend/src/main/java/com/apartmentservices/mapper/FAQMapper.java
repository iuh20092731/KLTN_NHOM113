package com.apartmentservices.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.dto.request.FAQCreationRequest;
import com.apartmentservices.dto.request.FAQUpdateRequest;
import com.apartmentservices.dto.response.FAQResponse;
import com.apartmentservices.models.FAQ;

@Mapper(componentModel = "spring")
public interface FAQMapper {

//    FAQ toFAQ(FAQCreationRequest request);

    @Mapping(target = "advertisementId", source = "advertisement.advertisementId")
    FAQResponse toFAQResponse(FAQ faq);

    @Mapping(target = "advertisement", ignore = true)
    void updateFAQFromRequest(FAQUpdateRequest request, @MappingTarget FAQ faq);

    @Mapping(target = "advertisement.advertisementId", source = "advertisementId") // Map advertisementId từ request sang quan hệ
    FAQ toFAQ(FAQCreationRequest request);

}
