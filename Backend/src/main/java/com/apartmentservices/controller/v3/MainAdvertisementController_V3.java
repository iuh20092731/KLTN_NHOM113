package com.apartmentservices.controller.v3;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.MainAdvertisementCreationRequest;
import com.apartmentservices.dto.response.MainAdvertisementResponse_V2;
import com.apartmentservices.services.AdvertisementServiceService;
import com.apartmentservices.services.MainAdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v3/main-advertisements")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MainAdvertisementController_V3 {
    MainAdvertisementService mainAdvertisementService;
    AdvertisementServiceService advertisementServiceService;

    @PostMapping
    @Operation(summary = "Create Main Advertisement", description = "Create a new main advertisement / Tạo một quảng cáo chính mới")
    ApiResponse<MainAdvertisementResponse_V2> createMainAdvertisement_V3(@RequestBody @Valid MainAdvertisementCreationRequest request) {
        return ApiResponse.<MainAdvertisementResponse_V2>builder()
                .result(mainAdvertisementService.createAdvertisement_V3(request))
                .build();
    }
}
