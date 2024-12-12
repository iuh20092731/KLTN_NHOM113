package com.apartmentservices.dto.response;

import java.util.Set;

import com.apartmentservices.constant.UserType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDetailResponse {
    String userId;
    String username;
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    String zalo;
    String facebook;
    String avatar;
    boolean isActive;
    UserType userType;
    Set<RoleResponse> roles;
}
