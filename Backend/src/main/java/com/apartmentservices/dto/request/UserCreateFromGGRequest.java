package com.apartmentservices.dto.request;

import com.apartmentservices.constant.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateFromGGRequest {

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL")
    String email;

    @NotBlank(message = "FIRST_NAME_REQUIRED")
    String givenName;

    @NotBlank(message = "LAST_NAME_REQUIRED")
    String familyName;

    String avatar;

    UserType userType = UserType.USER; // Mặc định là USER
}
