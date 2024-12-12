package com.apartmentservices.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Permission {
    @Id
    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String name;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String description;
}
