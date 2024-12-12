package com.apartmentservices.controller;

import com.apartmentservices.dto.request.info.SocialGroupLinkCreationRequest;
import com.apartmentservices.dto.request.info.SocialGroupLinkUpdateRequest;
import com.apartmentservices.dto.response.info.SocialGroupLinkResponse;
import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.services.SocialGroupLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/social-group-links")
@RequiredArgsConstructor
@Tag(name = "Social Group Link Controller", description = "APIs for managing social group links / Các API để quản lý liên kết nhóm xã hội")
public class SocialGroupLinkController {

    private final SocialGroupLinkService socialGroupLinkService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create Social Group Link", description = "Create a new social group link / Tạo một liên kết nhóm xã hội mới")
    public ApiResponse<SocialGroupLinkResponse> createLink(@RequestBody SocialGroupLinkCreationRequest request) {
        System.out.println("Creating link 322322: "+ request);
        SocialGroupLinkResponse response = socialGroupLinkService.createLink(request);
        return ApiResponse.<SocialGroupLinkResponse>builder().result(response).build();
    }

    @GetMapping("/{linkId}")
    @Operation(summary = "Get Social Group Link", description = "Get a social group link by its ID / Lấy liên kết nhóm xã hội theo ID")
    public ApiResponse<SocialGroupLinkResponse> getLink(@PathVariable("linkId") Integer linkId) {
        SocialGroupLinkResponse response = socialGroupLinkService.getLinkById(linkId);
        return ApiResponse.<SocialGroupLinkResponse>builder().result(response).build();
    }

    @GetMapping
    @Operation(summary = "Get All Social Group Links", description = "Retrieve a list of all social group links / Lấy danh sách tất cả các liên kết nhóm xã hội")
    public ApiResponse<List<SocialGroupLinkResponse>> getAllLinks() {
        List<SocialGroupLinkResponse> response = socialGroupLinkService.getAllLinks();
        return ApiResponse.<List<SocialGroupLinkResponse>>builder().result(response).build();
    }

    @PutMapping("/{linkId}")
    @Operation(summary = "Update Social Group Link", description = "Update an existing social group link by its ID / Cập nhật một liên kết nhóm xã hội theo ID")
    public ApiResponse<SocialGroupLinkResponse> updateLink(
            @PathVariable("linkId") Integer linkId,
            @RequestBody SocialGroupLinkUpdateRequest request) {
        SocialGroupLinkResponse response = socialGroupLinkService.updateLink(linkId, request);
        return ApiResponse.<SocialGroupLinkResponse>builder().result(response).build();
    }

    @DeleteMapping("/{linkId}")
    @Operation(summary = "Delete Social Group Link", description = "Delete a social group link by its ID / Xóa một liên kết nhóm xã hội theo ID")
    public ApiResponse<String> deleteLink(@PathVariable("linkId") Integer linkId) {
        socialGroupLinkService.deleteLink(linkId);
        return ApiResponse.<String>builder().result("Social group link has been deleted / Liên kết nhóm xã hội đã được xóa").build();
    }
}
