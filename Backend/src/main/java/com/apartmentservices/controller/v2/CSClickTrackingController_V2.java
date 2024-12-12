package com.apartmentservices.controller.v2;


import com.apartmentservices.dto.response.ClickTrackingReportResponse;
import com.apartmentservices.dto.response.ClickTrackingReportResponse_V2;
import com.apartmentservices.services.CSClickTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v2/click-tracking")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Click Tracking Controller")
public class CSClickTrackingController_V2 {

    CSClickTrackingService csClickTrackingService;

    @GetMapping("/reports/category")
    @Operation(summary = "Get click tracking reports by category", description = "Retrieves click tracking reports by category.")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClickTrackingReportResponse_V2>> getReportsByCategory(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam(required = false) LocalDateTime defaultDate) {

        // Tính toán tháng trước
        Integer previousMonth = (month == 1) ? 12 : month - 1;
        Integer previousYear = (month == 1) ? year - 1 : year;

        // Gọi service để lấy báo cáo theo loại
        List<ClickTrackingReportResponse_V2> reports = csClickTrackingService.getClickTrackingReportsByCategory_V2(year, month, previousMonth, defaultDate);

        return ResponseEntity.ok(reports);
    }
}
