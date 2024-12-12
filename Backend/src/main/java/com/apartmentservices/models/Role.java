package com.apartmentservices.models;

import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Role {
    @Id
    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String name;

    @Column(columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String description;

    @ManyToMany
    Set<Permission> permissions;
}
