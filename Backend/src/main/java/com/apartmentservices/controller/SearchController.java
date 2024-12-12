package com.apartmentservices.controller;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.SearchRequest;
import com.apartmentservices.dto.response.SearchResponse;
import com.apartmentservices.services.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Search", description = "API for searching services and advertisements - API để tìm kiếm dịch vụ và quảng cáo")
public class SearchController {

    SearchService searchService;

    @PostMapping("/v1/search")
    @Operation(summary = "Search Services and Advertisements", description = "Search for services and advertisements by keyword")
    public ApiResponse<SearchResponse> search(@RequestBody @Valid SearchRequest request) {
        log.info("Search requested for keyword: {}", request.getKeyword());
        SearchResponse searchResults = searchService.search(request.getKeyword());
        return ApiResponse.<SearchResponse>builder()
                .result(searchResults)
                .build();
    }



}
