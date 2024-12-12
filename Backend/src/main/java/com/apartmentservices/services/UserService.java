package com.apartmentservices.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.apartmentservices.constant.UserType;
import com.apartmentservices.dto.request.*;
import com.apartmentservices.dto.response.*;
import com.apartmentservices.dto.response.v2.UserResponse_V2;
import com.apartmentservices.exception.ResourceNotFoundException;
import com.apartmentservices.models.Otp;
import com.apartmentservices.repositories.OtpRepository;
import lombok.experimental.NonFinal;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.apartmentservices.constant.PredefinedRole;
import com.apartmentservices.models.Role;
import com.apartmentservices.models.User;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.mapper.UserMapper;
import com.apartmentservices.repositories.RoleRepository;
import com.apartmentservices.repositories.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    OtpRepository otpRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    EmailService emailService;
    AuthenticationService authenticationService;

    @NonFinal
    @Value("${dichvuhungngan.google.login.password}")
    protected String GOOGLE_LOGIN_PASSWORD;

    public OtpResponse resendOtp(OtpResendRequest request) {
        // Tìm người dùng dựa trên email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Tạo OTP mới
        String newOtp = String.format("%06d", new Random().nextInt(1000000));

        // Cập nhật OTP trong cơ sở dữ liệu
        Otp otpEntity = otpRepository.findByUser(user)
                .orElse(new Otp());
        otpEntity.setOtpCode(newOtp);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpEntity.setVerified(false);
        otpEntity.setUser(user);

        otpRepository.save(otpEntity);

        // Gửi OTP qua email với cấu trúc đồng bộ với email xác thực đăng ký tài khoản
        String subject = "Yêu cầu gửi lại mã xác thực - Dịch vụ Hưng Ngân";
        String body = String.format(
                "<div style=\"text-align: center;\">" +
                        "<img src=\"https://res.cloudinary.com/tranquanghuyit09/image/upload/v1729711401/ApartmentServices/kqjykdmipbics2aiynne.png\" " +
                        "alt=\"Logo Dịch vụ Hưng Ngân\" style=\"width: 150px; height: auto;\">" +
                        "</div>" +
                        "<p>Xin chào <b>%s %s</b>!</p>" +
                        "<p>Bạn đã yêu cầu gửi lại mã xác thực (OTP) cho tài khoản của mình. Vui lòng sử dụng mã bên dưới để hoàn tất xác thực:</p>" +
                        "<p><b>Mã xác thực (OTP):</b> <span style=\"font-size: 24px; font-weight: bold; color: #d9534f;\">%s</span></p>" +
                        "<p>Nếu bạn không yêu cầu gửi lại mã xác thực, có thể tài khoản của bạn đang gặp nguy hiểm. " +
                        "Hãy liên hệ với chúng tôi ngay lập tức để đảm bảo an toàn cho tài khoản của bạn.</p>" +
                        "<p>Khám phá ngay những dịch vụ tiện ích hàng đầu xung quanh Chung cư Hưng Ngân – " +
                        "Tận hưởng cuộc sống trọn vẹn với sự thuận tiện chỉ trong tầm tay!</p>" +
                        "<p><b>Facebook:</b> <a href=\"https://www.facebook.com/dichvuHungNganNew\">Dịch vụ Hưng Ngân</a><br>" +
                        "<b>YouTube:</b> <a href=\"https://www.youtube.com/@dichvuHungNgan\">Dịch vụ Hưng Ngân</a><br>" +
                        "<b>Email:</b> dichvuhungngan@gmail.com<br>" +
                        "<b>Số điện thoại:</b> 0909260517<br>" +
                        "<b>Địa chỉ:</b> Chung Cư Hưng Ngân - 48 Đường Thị Mười, Phường Tân Chánh Hiệp, Quận 12</p>" +
                        "<p>Cảm ơn bạn đã lựa chọn Dịch vụ Hưng Ngân!</p>" +
                        "<p>Trân trọng,<br>Đội ngũ Dịch vụ Hưng Ngân</p>",
                user.getFirstName(), user.getLastName(), newOtp
        );
        emailService.sendEmail(user.getEmail(), subject, body, true);

        // Thiết lập thông tin trả về trong OtpResponse
        return OtpResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .otp("******")  // Ẩn OTP trong phản hồi
                .verified(otpEntity.isVerified())
                .message("OTP đã được gửi lại thành công!")
                .message2("Vui lòng kiểm tra email của bạn để xác thực.")
                .build();
    }


    public OtpResponse createUserV2(UserCreationRequest_V2 request) {
        // Kiểm tra xem người dùng đã tồn tại chưa
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new AppException(ErrorCode.USER_EXISTED);
        });

        // Tạo một mã OTP ngẫu nhiên
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // Tạo đối tượng người dùng mới
        User user = userMapper.toUser_V2(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Otp otpEntity = new Otp();
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpEntity.setOtpCode(otp);
        otpEntity.setVerified(false);
        otpEntity.setUser(user);

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);
        user.setRoles(roles);

        OtpResponse otpResponse = new OtpResponse();

        try {
            user = userRepository.save(user);
            otpEntity = otpRepository.save(otpEntity);

            // Gửi email xác thực chứa OTP
//            String subject = "Xác thực đăng ký tài khoản - Dịch vụ Hưng Ngân";
//            String body = String.format(
//                    "Xin chào %s %s!\n\n" +
//                            "Một yêu cầu đăng ký tài khoản cần được xác minh thêm vì chúng tôi không nhận diện được thiết bị của bạn. " +
//                            "Để hoàn tất đăng ký, vui lòng nhập mã xác thực bên dưới:\n\n" +
//                            "Thiết bị: Trình duyệt Chrome trên Windows\n" +
//                            "Mã xác thực (OTP): %s\n\n" +
//                            "Nếu bạn không yêu cầu đăng ký tài khoản này, có thể mật khẩu của bạn đã bị lộ. " +
//                            "Hãy liên hệ với chúng tôi ngay lập tức để đảm bảo an toàn cho tài khoản của bạn.\n\n" +
//                            "Khám phá ngay những dịch vụ tiện ích hàng đầu xung quanh Chung cư Hưng Ngân – Tận hưởng cuộc sống trọn vẹn với sự thuận tiện chỉ trong tầm tay!\n\n" +
//                            "Facebook: https://www.facebook.com/dichvuHungNganNew\n" +
//                            "YouTube: https://www.youtube.com/@dichvuHungNgan\n" +
//                            "Email: dichvuhungngan@gmail.com\n" +
//                            "Số điện thoại: 0909260517\n" +
//                            "Địa chỉ: Chung Cư Hưng Ngân - 48 Đường Thị Mười, Phường Tân Chánh Hiệp, Quận 12\n\n" +
//                            "Cảm ơn bạn đã lựa chọn Dịch vụ Hưng Ngân!\n\n" +
//                            "Trân trọng,\n" +
//                            "Đội ngũ Dịch vụ Hưng Ngân",
//                    user.getFirstName(), user.getLastName(), otp
//            );
//            emailService.sendEmail(user.getEmail(), subject, body);

            String subject = "Xác thực đăng ký tài khoản - Dịch vụ Hưng Ngân";
            String body = String.format(
                    "<div style=\"text-align: center;\">" +
                            "<img src=\"https://res.cloudinary.com/tranquanghuyit09/image/upload/v1729711401/ApartmentServices/kqjykdmipbics2aiynne.png\" " +
                            "alt=\"Logo Dịch vụ Hưng Ngân\" style=\"width: 150px; height: auto;\">" +
                            "</div>" +
                            "<p>Xin chào <b>%s %s</b>!</p>" +
                            "<p>Một yêu cầu đăng ký tài khoản cần được xác minh thêm vì chúng tôi không nhận diện được thiết bị của bạn. " +
                            "Để hoàn tất đăng ký, vui lòng nhập mã xác thực bên dưới:</p>" +
                            "<p><b>Thiết bị:</b> %s</p>" +
                            "<p><b>Mã xác thực (OTP):</b> <span style=\"font-size: 24px; font-weight: bold; color: #d9534f;\">%s</span></p>" +
                            "<p>Nếu bạn không yêu cầu đăng ký tài khoản này, có thể mật khẩu của bạn đã bị lộ. " +
                            "Hãy liên hệ với chúng tôi ngay lập tức để đảm bảo an toàn cho tài khoản của bạn.</p>" +
                            "<p>Khám phá ngay những dịch vụ tiện ích hàng đầu xung quanh Chung cư Hưng Ngân – " +
                            "Tận hưởng cuộc sống trọn vẹn với sự thuận tiện chỉ trong tầm tay!</p>" +
                            "<p><b>Facebook:</b> <a href=\"https://www.facebook.com/dichvuHungNganNew\">Dịch vụ Hưng Ngân</a><br>" +
                            "<b>YouTube:</b> <a href=\"https://www.youtube.com/@dichvuHungNgan\">Dịch vụ Hưng Ngân</a><br>" +
                            "<b>Email:</b> dichvuhungngan@gmail.com<br>" +
                            "<b>Số điện thoại:</b> 0909260517<br>" +
                            "<b>Địa chỉ:</b> Chung Cư Hưng Ngân - 48 Đường Thị Mười, Phường Tân Chánh Hiệp, Quận 12</p>" +
                            "<p>Cảm ơn bạn đã lựa chọn Dịch vụ Hưng Ngân!</p>" +
                            "<p>Trân trọng,<br>Đội ngũ Dịch vụ Hưng Ngân</p>",
                    user.getFirstName(), user.getLastName(), request.getDeviceInfo(), otp
            );
            emailService.sendEmail(user.getEmail(), subject, body, true);


            // Thiết lập thông tin trả về trong OtpResponse
            otpResponse = OtpResponse.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .otp("******")
                    .verified(otpEntity.isVerified())
                    .message("OTP sent successfully!")
                    .message2("Please check your email for verification.")
                    .build();

        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_CREATION_FAILED);
        }

        return otpResponse;
    }

    public OtpResponseVerified verifyAccount(String email, String otpCode) {
        // Tìm kiếm người dùng theo email
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        User user = userOpt.get();

        // Kiểm tra người dùng đã xác thực hay chưa
        if (user.isActive()) {
            return OtpResponseVerified.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .verified(true)
                    .message("Tài khoản đã được xác thực trước đó.")
                    .build();
        }

        // Tìm OTP theo người dùng
        Optional<Otp> otpOpt = otpRepository.findByUser(user);
        if (otpOpt.isEmpty()) {
            throw new AppException(ErrorCode.OTP_NOT_FOUND);
        }

        Otp otp = otpOpt.get();

        // Kiểm tra mã OTP có khớp và còn hạn không
        if (otp.isVerified()) {
            return OtpResponseVerified.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .verified(true)
                    .message("Mã OTP đã được xác thực trước đó.")
                    .build();
        }

        if (!otp.getOtpCode().equals(otpCode)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

        // Cập nhật trạng thái xác thực cho người dùng và OTP
        otp.setVerified(true);
        user.setActive(true);
        otpRepository.save(otp);
        userRepository.save(user);

        return OtpResponseVerified.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .verified(true)
                .message("Xác thực tài khoản thành công.")
                .build();
    }

    //    Only Admin can access this method
    public UserResponse createUser_ADMIN(UserCreationRequest request) {
        User user = userMapper.toUser(request);

        // Nếu mật khẩu không được cung cấp, đặt mật khẩu mặc định là username + "1"
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getUsername() + "1!"));
        } else {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user.setActive(true);

        HashSet<Role> roles = new HashSet<>();

        // Nếu userType là ADMIN, thêm quyền ADMIN, ngược lại thêm quyền USER
        if (request.getUserType() == UserType.ADMIN) {
            roleRepository.findById(PredefinedRole.ADMIN_ROLE).ifPresent(roles::add);
        } else {
            roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);
        }

        user.setRoles(roles);

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return userMapper.toUserResponse(user);
    }


    public UserResponse createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return userMapper.toUserResponse(user);
    }

//    public UserInfoResponse getMyInfo() {
//        var context = SecurityContextHolder.getContext();
//        String name = context.getAuthentication().getName();
//
//        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
//
//        return userMapper.toUserInfoResponse(user);
//    }

    public UserInfoResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        UserInfoResponse userInfoResponse = userMapper.toUserInfoResponse(user);

        // Kiểm tra xem user có mật khẩu không
        userInfoResponse.setHasPassword(user.getPassword() != null && !user.getPassword().isEmpty());

        return userInfoResponse;
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Cập nhật các trường trong User
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getZalo() != null) {
            user.setZalo(request.getZalo());
        }
        if (request.getFacebook() != null) {
            user.setFacebook(request.getFacebook());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }


    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    //    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    public List<UserResponse> searchAdvertisers(String keyword) {
        // Tìm kiếm người dùng có loại là ADVERTISER theo nhiều tiêu chí
        List<User> activeAdvertisers = userRepository.findByIsActiveAndUserTypeAndFirstNameContainingIgnoreCaseOrIsActiveAndUserTypeAndLastNameContainingIgnoreCaseOrIsActiveAndUserTypeAndUsernameContainingIgnoreCaseOrIsActiveAndUserTypeAndUserId(
                true, UserType.ADVERTISER, keyword,
                true, UserType.ADVERTISER, keyword,
                true, UserType.ADVERTISER, keyword,
                true, UserType.ADVERTISER, keyword);

        if (activeAdvertisers.isEmpty()) {
            throw new AppException(ErrorCode.SEARCH_EMPTY);
        }
        return activeAdvertisers.stream().map(userMapper::toUserResponseForSearch).toList();
    }

    public List<UserResponse> searchAdvertisers_V2(String keyword) {
        // Tìm kiếm người dùng chỉ dựa trên từ khóa và trạng thái hoạt động
        List<User> activeUsers = userRepository.findByIsActiveAndFirstNameContainingIgnoreCaseOrIsActiveAndLastNameContainingIgnoreCaseOrIsActiveAndUsernameContainingIgnoreCaseOrIsActiveAndUserId(
                true, keyword,
                true, keyword,
                true, keyword,
                true, keyword);

        if (activeUsers.isEmpty()) {
            throw new AppException(ErrorCode.SEARCH_EMPTY);
        }

        return activeUsers.stream().map(userMapper::toUserResponseForSearch).toList();
    }

    public AuthenticationResponse saveUserFromGoogle(Map<String, Object> attributes) {
        String email = (String) attributes.get("email");

        // Kiểm tra nếu người dùng đã tồn tại
        if (userRepository.existsByEmail(email)) {
            User existingUser = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            String passwordEncode = passwordEncoder.encode(existingUser.getPassword());
            log.info("Password" + passwordEncode);

            // Gọi phương thức authenticate để đăng nhập và lấy token
            AuthenticationRequest authRequest = new AuthenticationRequest(email, GOOGLE_LOGIN_PASSWORD);
            return authenticationService.authenticate(authRequest); // Trả về AuthenticationResponse
        }

        // Tạo password mặc định là username + "1!"
        String defaultPassword = email + "1!";

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);


        // Tạo mới người dùng nếu chưa tồn tại
        User user = User.builder()
                .email(email)
                .firstName((String) attributes.get("given_name"))
                .lastName((String) attributes.get("family_name"))
                .username(email)
//                .password(new BCryptPasswordEncoder().encode(defaultPassword)) // Mã hóa password
                .password(passwordEncoder.encode(defaultPassword))
                .avatar((String) attributes.get("picture"))
                .isActive(true)
                .userType(UserType.USER)
                .roles(roles)
                .isActive(true)
                .build();

        // Lưu người dùng mới vào database
        userRepository.save(user);

        // Gọi phương thức authenticate để đăng nhập và lấy token
        AuthenticationRequest authRequest = new AuthenticationRequest(user.getUsername(), defaultPassword);
        return authenticationService.authenticate(authRequest); // Trả về AuthenticationResponse
    }


    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUserFromGoogle(User existingUser, Map<String, Object> attributes) {
        existingUser.setFirstName((String) attributes.get("given_name"));
        existingUser.setLastName((String) attributes.get("family_name"));
        existingUser.setAvatar((String) attributes.get("picture"));
        // Cập nhật thêm các thuộc tính nếu cần

        return userRepository.save(existingUser); // Cập nhật vào cơ sở dữ liệu
    }

    public ApiResponse<UpdatePasswordResponse> updatePassword(String userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INCORRECT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        UpdatePasswordResponse response = UpdatePasswordResponse.builder()
                .success(true)
                .message("Password updated successfully")
                .build();

        return ApiResponse.<UpdatePasswordResponse>builder()
                .result(response)
                .build();
    }

    public List<UserDetailResponse> filterUsers(Boolean isActive, UserType userType) {
        List<User> users;

        if (isActive == null && userType == null) {
            // Nếu không có điều kiện nào, lấy tất cả người dùng
            users = userRepository.findAll();
        } else if (isActive != null && userType == null) {
            // Nếu chỉ có isActive, lọc theo isActive
            users = userRepository.findByIsActive(isActive);
        } else if (isActive == null && userType != null) {
            // Nếu chỉ có userType, lọc theo userType
            users = userRepository.findByUserType(userType);
        } else {
            // Nếu có cả isActive và userType, lọc theo cả hai
            users = userRepository.findByIsActiveAndUserType(isActive, userType);
        }

        // Sử dụng userMapper để chuyển đổi User thành UserDetailResponse
        return users.stream()
                .map(userMapper::toUserDetailResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUserStatus(String userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Cập nhật trạng thái
        user.setActive(request.getIsActive());
        userRepository.save(user);

        return userMapper.toUserResponse(user); // Hoặc trả về entity UserResponse tương ứng
    }

    private Long getTotalActiveUsersByMonth(int year, int month) {
        LocalDateTime startDate = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endDate = LocalDate.of(year, month, startDate.toLocalDate().lengthOfMonth()).atTime(23, 59, 59);
        return userRepository.countActiveUsersByMonth(startDate, endDate);
    }

    private Double getActiveUserChangeRate(int year, int month) {
        Long currentMonthActiveUsers = getTotalActiveUsersByMonth(year, month);
        Long previousMonthActiveUsers = getTotalActiveUsersByMonth(
                month == 1 ? year - 1 : year,
                month == 1 ? 12 : month - 1
        );

        if (currentMonthActiveUsers == 0) return -100.0;
        if (previousMonthActiveUsers == 0) return 100.0;

        // Tính tỷ lệ chênh lệch phần trăm
        double rate = ((double) currentMonthActiveUsers - previousMonthActiveUsers) / previousMonthActiveUsers * 100;

        // Làm tròn 2 chữ số thập phân
        return Math.round(rate * 100.0) / 100.0;
    }

    public MonthlyUserStatsResponse getMonthlyUserStats(int year, int month) {
        Long totalActiveUsers = getTotalActiveUsersByMonth(year, month);
        Double percentageChange = getActiveUserChangeRate(year, month);
        return new MonthlyUserStatsResponse(totalActiveUsers, percentageChange);
    }

    public Page<UserResponse_V2> getTopNewUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo đối tượng Pageable
        Page<User> usersPage = userRepository.findTopNewUsers(pageable); // Lấy trang dữ liệu từ repository

        return usersPage.map(user -> new UserResponse_V2(
                user.getUserId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getAvatar(),
                user.getPhoneNumber(),
                null
        ));
    }

}