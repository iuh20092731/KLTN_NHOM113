package com.apartmentservices.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "WebVisits")
public class WebVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VisitID", nullable = false)
    Integer visitId;

    @Column(name = "VisitDate", nullable = false)
    LocalDate visitDate;

    @Column(name = "TotalVisits", columnDefinition = "INT DEFAULT 0")
    Integer totalVisits;

    @Column(name = "Duration", nullable = false)
    Long duration; // Thời gian ở lại trang (tính bằng giây)

    public WebVisit(LocalDate visitDate, Integer totalVisits, Long duration) {
        this.visitDate = visitDate;
        this.totalVisits = totalVisits;
        this.duration = duration;
    }
}
