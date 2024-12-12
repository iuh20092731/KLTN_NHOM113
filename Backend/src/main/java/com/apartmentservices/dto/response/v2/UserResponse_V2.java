package com.apartmentservices.dto.response.v2;

import com.apartmentservices.dto.response.RoleResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse_V2 {
    String id;
    String username;
    String firstName;
    String lastName;
    String avatar;
    String phoneNumber;
    Set<RoleResponse> roles;
}
