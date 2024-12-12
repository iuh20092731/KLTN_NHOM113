package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.CSClickTrackingRequest;
import com.apartmentservices.dto.response.CSClickTrackingResponse;
import com.apartmentservices.dto.response.ClickTrackingReportResponse;
import com.apartmentservices.models.CSClickTracking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface CSClickTrackingMapper {
//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "clickCount", source = "clickCount")
//    @Mapping(target = "remark", source = "remark")
//    @Mapping(target = "valueId", source = "valueId")
    CSClickTrackingResponse toResponse(CSClickTracking clickTracking);

    CSClickTracking toEntity(CSClickTrackingRequest request);

    @Mapping(target = "name", source = "name")
    ClickTrackingReportResponse toDto(Integer type, Integer valueId, String name, long clickCount, LocalDateTime lastClicked, long previousMonthClickCount);
}
