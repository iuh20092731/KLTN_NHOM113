package com.apartmentservices.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.apartmentservices.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String firstName;
    String lastName;
    String zalo;
    String facebook;
    String avatar;
    String password;
}
