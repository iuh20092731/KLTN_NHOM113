    package com.apartmentservices.models;

    import jakarta.persistence.*;
    import lombok.*;
    import lombok.experimental.FieldDefaults;

    import java.time.LocalDateTime;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Entity
    @Table(name = "CSClickTracking")
    public class CSClickTracking {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Long id;

        Integer type; // 1: Category, 2: Service

        Integer valueId;

        long clickCount;

        @Column(name = "last_clicked")
        LocalDateTime lastClicked;

        String remark;

        public void incrementClickCount() {
            this.clickCount++;
            this.lastClicked = LocalDateTime.now();
        }
    }
