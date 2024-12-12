package com.apartmentservices.controller;

import java.text.ParseException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.AuthenticationRequest;
import com.apartmentservices.dto.request.IntrospectRequest;
import com.apartmentservices.dto.request.LogoutRequest;
import com.apartmentservices.dto.request.RefreshRequest;
import com.apartmentservices.dto.response.UserResponse;
import com.apartmentservices.models.User;
import com.apartmentservices.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.response.AuthenticationResponse;
import com.apartmentservices.dto.response.IntrospectResponse;
import com.apartmentservices.services.AuthenticationService;
import com.nimbusds.jose.JOSEException;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication Controller")
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserService userService;

    @Operation(summary = "Authenticate User", description = "Authenticate a user and generate a JWT token / Xác thực người dùng và tạo JWT token")
    @PostMapping("/token")
//    @PreAuthorize("hasPermission('token', 'create')")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @Operation(summary = "Introspect Token", description = "Check the validity and status of a JWT token / Kiểm tra tính hợp lệ và trạng thái của token JWT")
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @Operation(summary = "Refresh Token", description = "Refresh a JWT token when it has expired or is close to expiry / Làm mới token JWT khi token hết hạn hoặc gần hết hạn")
    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @Operation(summary = "Logout User", description = "Invalidate a user's token and log them out / Vô hiệu hóa token của người dùng và đăng xuất họ")
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

//    @GetMapping("/login-success")
//    public ResponseEntity<User> loginSuccess(OAuth2AuthenticationToken authentication) {
//        // Lấy thông tin người dùng từ Google
//        OAuth2User user = authentication.getPrincipal();
//        Map<String, Object> attributes = user.getAttributes();
//
//        // Kiểm tra xem người dùng đã tồn tại chưa
//        String email = (String) attributes.get("email");
//        Optional<User> existingUser = userService.findByEmail(email);
//
//        User savedUser;
//        if (existingUser.isPresent()) {
//            // Nếu người dùng đã tồn tại, có thể cập nhật thông tin
//            savedUser = userService.updateUserFromGoogle(existingUser.orElse(null), attributes);
//        } else {
//            // Nếu không, lưu thông tin người dùng mới
//            savedUser = userService.saveUserFromGoogle(attributes);
//        }
//
//        // Chuyển đổi User sang UserResponse (nếu cần)
//        User userResponse = User.builder()
//                .userId(savedUser.getUserId())
//                .email(savedUser.getEmail())
//                .firstName(savedUser.getFirstName())
//                .lastName(savedUser.getLastName())
//                .avatar(savedUser.getAvatar()) // Nếu bạn muốn trả về avatar
//                .isActive(savedUser.isActive())
//                .userType(savedUser.getUserType())
//                .build();
//
//        return ResponseEntity.ok(userResponse);
//    }


    @GetMapping("/login-failure")
    public ResponseEntity<String> loginFailure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login with Google failed");
    }

//    @PostMapping("/login/google")
//    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, Object> authResponse) {
//        try {
//            // Giả sử authResponse chứa thông tin từ Google
//            Map<String, Object> attributes = (Map<String, Object>) authResponse.get("attributes");
//            Optional<User> savedUser = userService.saveUserFromGoogle(attributes);
//
//            // Tạo phản hồi
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Login successful");
//            response.put("userId", savedUser.map(User::getUserId).orElse("unknown"));
//            response.put("result", savedUser.isPresent());
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Collections.singletonMap("message", "An error occurred during login"));
//        }
//    }
}
