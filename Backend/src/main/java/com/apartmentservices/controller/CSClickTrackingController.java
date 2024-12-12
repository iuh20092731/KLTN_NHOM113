package com.apartmentservices.controller;

import java.time.LocalDateTime;
import java.util.List;

import com.apartmentservices.dto.response.CSClickTrackingResponse;
import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.response.ClickTrackingReportResponse;
import com.apartmentservices.mapper.CSClickTrackingMapper;
import com.apartmentservices.models.CSClickTracking;
import com.apartmentservices.services.CSClickTrackingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/click-tracking")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Click Tracking Controller")
public class CSClickTrackingController {
    CSClickTrackingService csClickTrackingService;
    CSClickTrackingMapper csClickTrackingMapper;

    @GetMapping
    @Operation(summary = "Get or create click tracking", description = "Increments the click count for the given type and valueId. Creates a new record if it does not exist.")
    public ApiResponse<CSClickTrackingResponse> getOrCreateClickTracking(
            @RequestParam Integer type,
            @RequestParam Integer valueId) {

        CSClickTracking clickTracking = csClickTrackingService.getOrCreateClickTracking(type, valueId);
        return ApiResponse.<CSClickTrackingResponse>builder()
                .result(csClickTrackingMapper.toResponse(clickTracking))
                .build();
    }

    @GetMapping("/increment")
    @Operation(summary = "Get or create click tracking", description = "Increments the click count for the given type and valueId. Creates a new record if it does not exist.")
    public ApiResponse<CSClickTrackingResponse> getOrCreateClickTracking_V2(
            @RequestParam Integer type,
            @RequestParam Integer valueId) {

        CSClickTracking clickTracking = csClickTrackingService.getOrCreateClickTracking_V2(type, valueId);
        return ApiResponse.<CSClickTrackingResponse>builder()
                .result(csClickTrackingMapper.toResponse(clickTracking))
                .build();
    }

    @GetMapping("/all")
    @Operation(summary = "Get all click trackings", description = "Retrieves all click tracking records.")
    public ApiResponse<List<CSClickTrackingResponse>> getAllClickTrackings() {
        List<CSClickTracking> clickTrackings = csClickTrackingService.getAllClickTrackings();
        return ApiResponse.<List<CSClickTrackingResponse>>builder()
                .result(clickTrackings.stream()
                        .map(csClickTrackingMapper::toResponse)
                        .toList())
                .build();
    }

//    @GetMapping("/report")
//    public ResponseEntity<List<ClickTrackingReportResponse>> getClickTrackingReport(
//            @RequestParam Integer type,
//            @RequestParam Integer valueId,
//            @RequestParam int year,
//            @RequestParam int month) {
//        List<ClickTrackingReportResponse> report = csClickTrackingService.getClickTrackingReport(type, valueId, year, month);
//        return ResponseEntity.ok(report);
//    }

    @GetMapping("/reports/category")
    @Operation(summary = "Get click tracking reports by category", description = "Retrieves click tracking reports by category.")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClickTrackingReportResponse>> getReportsByCategory(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam(required = false) LocalDateTime defaultDate) {

        // Tính toán tháng trước
        Integer previousMonth = (month == 1) ? 12 : month - 1;
        Integer previousYear = (month == 1) ? year - 1 : year;

        // Gọi service để lấy báo cáo theo loại
        List<ClickTrackingReportResponse> reports = csClickTrackingService.getClickTrackingReportsByCategory(year, month, previousMonth, defaultDate);

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/service")
    @Operation(summary = "Get click tracking reports by service", description = "Retrieves click tracking reports by service.")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClickTrackingReportResponse>> getReportsByService(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam(required = false) LocalDateTime defaultDate) {

        // Tính toán tháng trước
        Integer previousMonth = (month == 1) ? 12 : month - 1;
        Integer previousYear = (month == 1) ? year - 1 : year;

        // Gọi service để lấy báo cáo theo loại
        List<ClickTrackingReportResponse> reports = csClickTrackingService.getClickTrackingReportsByService(year, month, previousMonth, defaultDate);

        return ResponseEntity.ok(reports);
    }

}
