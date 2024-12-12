package com.apartmentservices.mapper;


import com.apartmentservices.dto.request.info.SocialGroupLinkCreationRequest;
import com.apartmentservices.dto.request.info.SocialGroupLinkUpdateRequest;
import com.apartmentservices.dto.response.info.SocialGroupLinkResponse;
import com.apartmentservices.models.info.SocialGroupLink;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SocialGroupLinkMapper {

    @Mapping(target = "id", ignore = true)  // ID will be auto-generated
    @Mapping(target = "isActive", source = "isActive")
    SocialGroupLink toSocialGroupLink(SocialGroupLinkCreationRequest request);

    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "serial", source = "serial")
    SocialGroupLinkResponse toSocialGroupLinkResponse(SocialGroupLink link);

    void updateSocialGroupLink(@MappingTarget SocialGroupLink link, SocialGroupLinkUpdateRequest request);
}
