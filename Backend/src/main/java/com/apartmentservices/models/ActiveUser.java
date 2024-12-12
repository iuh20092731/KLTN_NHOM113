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
@Table(name = "ActiveUsers")
public class ActiveUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserSessionID")
    Integer userSessionId;

    @ManyToOne
    @JoinColumn(name = "UserID", referencedColumnName = "userId")
    User user;

    @Column(name = "SessionStart", nullable = false)
    LocalDateTime sessionStart;

    @Column(name = "LastActivity", nullable = false)
    LocalDateTime lastActivity;
}
