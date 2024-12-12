package com.apartmentservices.services;

import com.apartmentservices.dto.response.MonthlyVisitStatsResponse;
import com.apartmentservices.models.WebVisit;
import com.apartmentservices.repositories.WebVisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class WebVisitService {

    private final WebVisitRepository webVisitRepository;

    public WebVisitService(WebVisitRepository webVisitRepository) {
        this.webVisitRepository = webVisitRepository;
    }

    @Transactional
    public Integer incrementVisitCount() {
        // Tăng số lượt truy cập cho ngày hiện tại
        LocalDate today = LocalDate.now();
        WebVisit visit = webVisitRepository.findByVisitDate(today)
                .orElse(new WebVisit(null, today, 0, 0L));

        visit.setTotalVisits(visit.getTotalVisits() + 1);
        webVisitRepository.save(visit);

        return visit.getTotalVisits(); // Trả về số lượt đã thăm
    }

    public Long getTotalVisits() {
        return webVisitRepository.findAll().stream()
                .mapToLong(WebVisit::getTotalVisits)
                .sum();
    }


    public Long getDurationByDate(LocalDate date) {
        return webVisitRepository.findByVisitDate(date).stream()
                .mapToLong(WebVisit::getDuration)
                .sum();
    }

    private Long getTotalVisitsByMonth(int year, int month) {
        return webVisitRepository.findByVisitDateBetween(
                LocalDate.of(year, month, 1),
                LocalDate.of(year, month, LocalDate.of(year, month, 1).lengthOfMonth())
        ).stream().mapToLong(WebVisit::getTotalVisits).sum();
    }


    private Double getVisitRateComparedToPreviousMonth(int year, int month) {
        Long currentMonthVisits = getTotalVisitsByMonth(year, month);
        long previousMonthVisits = getTotalVisitsByMonth(
                month == 1 ? year - 1 : year,
                month == 1 ? 12 : month - 1
        );

        if (currentMonthVisits == 0) return 0.0;
        if (previousMonthVisits == 0) return 100.0;

        // Tính tỷ lệ chênh lệch phần trăm
        double rate = ((double) currentMonthVisits - previousMonthVisits) / previousMonthVisits * 100;

        BigDecimal roundedRate = new BigDecimal(rate).setScale(2, RoundingMode.HALF_UP);
        return roundedRate.doubleValue();
    }
    public MonthlyVisitStatsResponse getMonthlyVisitStats(int year, int month) {
        Long totalVisits = getTotalVisitsByMonth(year, month);
        Double visitRate = getVisitRateComparedToPreviousMonth(year, month);
        return new MonthlyVisitStatsResponse(totalVisits, visitRate);
    }

}
