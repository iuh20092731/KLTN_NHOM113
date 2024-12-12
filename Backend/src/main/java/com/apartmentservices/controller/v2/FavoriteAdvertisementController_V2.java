package com.apartmentservices.controller.v2;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.response.MainAdvertisementResponse;
import com.apartmentservices.services.FavoriteAdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v2/advertisement-services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Advertisement Service Controller", description = "APIs for managing advertisement services / Các API quản lý dịch vụ quảng cáo")
public class FavoriteAdvertisementController_V2 {

    FavoriteAdvertisementService favoriteAdvertisementService;



}
