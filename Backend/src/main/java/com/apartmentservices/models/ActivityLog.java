package com.apartmentservices.models;

import java.time.LocalDateTime;

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
@Table(name = "ActivityLogs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer logId;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    User user;

    @Column(name = "Action", nullable = false, length = 255)
    String action;

    @Column(name = "ActionDetails", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String actionDetails;

    @Column(name = "ActionDate", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    LocalDateTime actionDate;
}
