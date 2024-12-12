package com.apartmentservices.controller;

import com.apartmentservices.dto.response.MonthlyVisitStatsResponse;
import com.apartmentservices.models.WebVisit;
import com.apartmentservices.services.WebVisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/web-visits")
@Tag(name = "Web Visit Controller", description = "APIs for managing web visits / Các API để quản lý lượt truy cập web")
public class WebVisitController {

    private final WebVisitService webVisitService;

    public WebVisitController(WebVisitService webVisitService) {
        this.webVisitService = webVisitService;
    }

    @GetMapping("/increment")
    @Operation(summary = "Increment Visit Count", description = "Increment the total visit count and return the updated count / Tăng số lượt truy cập và trả về số lượt đã cập nhật")
    public ResponseEntity<Integer> incrementVisitCount() {
        Integer totalVisits = webVisitService.incrementVisitCount();
        return ResponseEntity.ok(totalVisits); // Trả về số lượt đã thăm
    }

    @GetMapping("/total")
    @Operation(summary = "Get Total Visits", description = "Retrieve the total number of visits / Lấy tổng số lượt truy cập")
    public ResponseEntity<Long> getTotalVisits() {
        Long totalVisits = webVisitService.getTotalVisits();
        return ResponseEntity.ok(totalVisits);
    }

    @GetMapping("/duration")
    @Operation(summary = "Get Duration by Date", description = "Get total visit duration for a specific date / Lấy tổng thời gian truy cập cho một ngày cụ thể")
    public ResponseEntity<Long> getDurationByDate(@RequestParam LocalDate date) {
        Long duration = webVisitService.getDurationByDate(date);
        return ResponseEntity.ok(duration);
    }

//    @GetMapping("/monthly-total")
//    @Operation(summary = "Get Monthly Total Visits", description = "Retrieve total visits for a given month and year / Lấy tổng số lượt truy cập theo tháng và năm")
//    public ResponseEntity<Long> getMonthlyTotalVisits(@RequestParam int year, @RequestParam int month) {
//        Long totalVisits = webVisitService.getTotalVisitsByMonth(year, month);
//        return ResponseEntity.ok(totalVisits);
//    }
//
//    @GetMapping("/monthly-rate")
//    @Operation(summary = "Get Visit Rate Compared to Previous Month", description = "Retrieve visit rate compared to the previous month / Lấy tỷ lệ lượt truy cập so với tháng trước")
//    public ResponseEntity<Double> getVisitRateComparedToPreviousMonth(@RequestParam int year, @RequestParam int month) {
//        Double visitRate = webVisitService.getVisitRateComparedToPreviousMonth(year, month);
//        return ResponseEntity.ok(visitRate);
//    }

    @GetMapping("/monthly-stats")
    @Operation(summary = "Get Monthly Visit Statistics", description = "Retrieve total visits and visit rate compared to the previous month / Lấy tổng số lượt truy cập và tỷ lệ truy cập so với tháng trước")
    public ResponseEntity<MonthlyVisitStatsResponse> getMonthlyVisitStats(@RequestParam int year, @RequestParam int month) {
        MonthlyVisitStatsResponse stats = webVisitService.getMonthlyVisitStats(year, month);
        return ResponseEntity.ok(stats);
    }
}
