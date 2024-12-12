package com.apartmentservices.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import com.apartmentservices.constant.UserType;
import com.apartmentservices.dto.request.*;
import com.apartmentservices.dto.response.*;
import com.apartmentservices.dto.response.v2.UserResponse_V2;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.services.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "User Controller")
public class UserController {
    UserService userService; 

    @PatchMapping("/{userId}/update-password")
    @Operation(summary = "Update Password", description = "API to update the user's password")
     ApiResponse<UpdatePasswordResponse> updatePassword(
            @PathVariable String userId,
            @RequestBody @Valid UpdatePasswordRequest request) {

        UpdatePasswordResponse response = userService.updatePassword(userId, request).getResult();
        return ApiResponse.<UpdatePasswordResponse>builder()
                .result(response)
                .build();
    }

    @PostMapping("/create/admin")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<UserResponse> createUser_V2_ADMIN(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser_ADMIN(request))
                .build();
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Filter Users", description = "Retrieve users based on their active status and user type")
    public ApiResponse<List<UserDetailResponse>> filterUsers(
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "userType", required = false) UserType userType) {
        return ApiResponse.<List<UserDetailResponse>>builder()
                .result(userService.filterUsers(isActive, userType))
                .build();
    }

    @PostMapping("/create")
    ApiResponse<OtpResponse> createUser_V2(@RequestBody @Valid UserCreationRequest_V2 request) {
        return ApiResponse.<OtpResponse>builder()
                .result(userService.createUserV2(request))
                .build();
    }

    @PostMapping("/login-with-google")
    public ResponseEntity<AuthenticationResponse> saveUserFromGoogle(@RequestBody UserCreateFromGGRequest userRequest) {
        Map<String, Object> attributes = Map.of(
                "email", userRequest.getEmail(),
                "given_name", userRequest.getGivenName(),
                "family_name", userRequest.getFamilyName(),
                "picture", userRequest.getAvatar()
        );

        // Gọi phương thức saveUserFromGoogle và nhận AuthenticationResponse
        AuthenticationResponse authResponse = userService.saveUserFromGoogle(attributes);

        // Trả về AuthenticationResponse trong ResponseEntity
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/resend-otp")
    ApiResponse<OtpResponse> resendOtp(@RequestBody @Valid OtpResendRequest request) {
        return ApiResponse.<OtpResponse>builder()
                .result(userService.resendOtp(request))
                .build();
    }


    @PostMapping("/verify-account")
    public ApiResponse<OtpResponseVerified> verifyAccount(@RequestParam String email, @RequestParam String otpCode) {
        OtpResponseVerified result = userService.verifyAccount(email, otpCode);
        return ApiResponse.<OtpResponseVerified>builder()
                .result(result)
                .build();
    }

    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        // Redirect đến Google OAuth
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("/oauth2/authorization/google"))
                .build();
    }

//    @PostMapping("/verify-account")
//    public ApiResponse<String> verifyAccount(@RequestParam String email, @RequestParam String otpCode) {
//        String result = userService.verifyAccount(email, otpCode);
//        return ApiResponse.<String>builder()
//                .result(result)
//                .build();
//    }




    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserInfoResponse> getMyInfo() {
        return ApiResponse.<UserInfoResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @Operation(summary = "Update user", description = "Send a request via this API to update user")
    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @Operation(summary = "Tìm kiếm người đăng ký quảng cáo (Advertiser)",
            description = "API này cho phép tìm kiếm người dùng có loại là ADVERTISER dựa trên từ khóa. " +
                    "Từ khóa có thể khớp với firstName, lastName, username hoặc userId.")
    @GetMapping("/advertisers/search")
    ApiResponse<List<UserResponse>> searchAdvertisers(@RequestParam("keyword") String keyword) {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.searchAdvertisers_V2(keyword))
                .build();
    }

    @PatchMapping("/{userId}/status")
    @Operation(summary = "Update User Status", description = "Update the active status of a user")
    public ApiResponse<UserResponse> updateUserStatus(
            @PathVariable String userId,
            @RequestBody @Valid UpdateUserStatusRequest request) {
        UserResponse response = userService.updateUserStatus(userId, request);
        return ApiResponse.<UserResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/monthly-stats")
    @Operation(summary = "Get Monthly User Statistics", description = "Retrieve total active users and percentage change compared to the previous month.")
    public ResponseEntity<MonthlyUserStatsResponse> getMonthlyUserStats(@RequestParam int year, @RequestParam int month) {
        MonthlyUserStatsResponse stats = userService.getMonthlyUserStats(year, month);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/top-new-users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Top New Users", description = "Retrieve top newly created users based on creation date with pagination.")
    public ApiResponse<Page<UserResponse_V2>> getTopNewUsers(
            @RequestParam("page") int page,
            @RequestParam("size") int size) {
        Page<UserResponse_V2> topNewUsers = userService.getTopNewUsers(page, size);
        return ApiResponse.<Page<UserResponse_V2>>builder()
                .result(topNewUsers)
                .build();
    }



}
