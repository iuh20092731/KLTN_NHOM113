package com.apartmentservices.dto.response;

import java.util.Set;

import com.apartmentservices.models.Role;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserInfoResponse {
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

    boolean hasPassword;

}