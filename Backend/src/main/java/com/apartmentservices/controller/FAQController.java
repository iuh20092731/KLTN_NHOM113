package com.apartmentservices.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.FAQCreationRequest;
import com.apartmentservices.dto.request.FAQUpdateRequest;
import com.apartmentservices.dto.response.FAQResponse;
import com.apartmentservices.services.FAQService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/faqs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "FAQ Controller", description = "APIs for managing frequently asked questions / Các API để quản lý các câu hỏi thường gặp")
public class FAQController {

    FAQService faqService;

//    @Operation(summary = "Create FAQ", description = "Create a new frequently asked question / Tạo một câu hỏi thường gặp mới")
//    @PostMapping
//    ApiResponse<FAQResponse> createFAQ(@RequestBody @Valid FAQCreationRequest request) {
//        return ApiResponse.<FAQResponse>builder()
//                .result(faqService.createFAQ(request))
//                .build();
//    }

    @Operation(summary = "Create FAQ", description = "Create a new frequently asked question / Tạo một câu hỏi thường gặp mới")
    @PostMapping
    public ApiResponse<FAQResponse> createFAQ(@RequestBody @Valid FAQCreationRequest request) {
        log.info("Request to create FAQ: {}", request);
        return ApiResponse.<FAQResponse>builder()
                .result(faqService.createFAQ(request))
                .build();
    }


    @GetMapping
    @Operation(summary = "Get All FAQs", description = "Retrieve a list of all frequently asked questions / Lấy danh sách tất cả các câu hỏi thường gặp")
    ApiResponse<List<FAQResponse>> getFAQs() {
        return ApiResponse.<List<FAQResponse>>builder()
                .result(faqService.getFAQs())
                .build();
    }

    @GetMapping("/{faqId}")
    @Operation(summary = "Get FAQ by ID", description = "Retrieve a frequently asked question by its ID / Lấy một câu hỏi thường gặp theo ID của nó")
    ApiResponse<FAQResponse> getFAQ(@PathVariable("faqId") Integer faqId) {
        return ApiResponse.<FAQResponse>builder()
                .result(faqService.getFAQById(faqId))
                .build();
    }
    @GetMapping("/advertisement/{advertisementId}")
    @Operation(summary = "Get FAQs by Advertisement ID", description = "Retrieve frequently asked questions associated with a specific advertisement / Lấy các câu hỏi thường gặp liên quan đến một quảng cáo cụ thể")
    ApiResponse<List<FAQResponse>> getFAQsByAdvertisementId(@PathVariable("advertisementId") Integer advertisementId) {
        return ApiResponse.<List<FAQResponse>>builder()
                .result(faqService.getFAQsByAdvertisementId(advertisementId))
                .build();
    }

    @PutMapping("/{faqId}")
    @Operation(summary = "Update FAQ", description = "Update an existing frequently asked question / Cập nhật một câu hỏi thường gặp đã tồn tại")
    public ApiResponse<FAQResponse> updateFAQ(
            @PathVariable Integer faqId,
            @RequestBody @Valid FAQUpdateRequest request) {
        log.info("Request to update FAQ with ID {}: {}", faqId, request);
        return ApiResponse.<FAQResponse>builder()
                .result(faqService.updateFAQ(faqId, request))
                .build();
    }

    @DeleteMapping("/{faqId}")
    @Operation(summary = "Delete FAQ", description = "Delete a frequently asked question by its ID / Xóa một câu hỏi thường gặp theo ID của nó")
    public ApiResponse<String> deleteFAQ(@PathVariable Integer faqId) {
        log.info("Request to delete FAQ with ID: {}", faqId);
        faqService.deleteFAQ(faqId);
        return ApiResponse.<String>builder()
                .result("FAQ with ID " + faqId + " has been deleted successfully.")
                .build();
    }



//    @PutMapping("/{faqId}")
//    @Operation(summary = "Update FAQ", description = "Update an existing frequently asked question / Cập nhật một câu hỏi thường gặp đã tồn tại")
//    ApiResponse<FAQResponse> updateFAQ(@PathVariable Long faqId, @RequestBody @Valid FAQUpdateRequest request) {
//        return ApiResponse.<FAQResponse>builder()
//                .result(faqService.updateFAQ(faqId, request))
//                .build();
//    }
//
//    @DeleteMapping("/{faqId}")
//    @Operation(summary = "Delete FAQ", description = "Delete a frequently asked question by its ID / Xóa một câu hỏi thường gặp theo ID của nó")
//    ApiResponse<String> deleteFAQ(@PathVariable Long faqId) {
//        faqService.deleteFAQ(faqId);
//        return ApiResponse.<String>builder()
//                .result("FAQ has been deleted")
//                .build();
//    }
}
