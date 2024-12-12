package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.BannerCreationRequest;
import com.apartmentservices.dto.request.BannerUpdateRequest;
import com.apartmentservices.dto.response.BannerResponse;
import com.apartmentservices.models.Banner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BannerMapper {

    @Mapping(target = "advertisementId", source = "advertisementId")
    Banner toBanner(BannerCreationRequest request);

    BannerResponse toBannerResponse(Banner banner);

    List<BannerResponse> toBannerResponses(List<Banner> banners);

    @Mapping(target = "bannerId", ignore = true) // Bỏ qua việc ánh xạ bannerId
    @Mapping(target = "imageUrl", source = "request.imageUrl") // Cụ thể hóa ánh xạ
    @Mapping(target = "linkUrl", source = "request.linkUrl")
    @Mapping(target = "title", source = "request.title")
    @Mapping(target = "description", source = "request.description")
    @Mapping(target = "startDate", source = "request.startDate")
    @Mapping(target = "endDate", source = "request.endDate")
    @Mapping(target = "isActive", source = "request.isActive")
    @Mapping(target = "type", source = "request.type")
    @Mapping(target = "seq", source = "request.seq")
    @Mapping(target = "serial", source = "request.serial")
    void updateBanner(@MappingTarget Banner existingBanner, BannerUpdateRequest request);
}
