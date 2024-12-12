package com.apartmentservices.repositories;

import com.apartmentservices.dto.response.ClickTrackingReportResponse;
import com.apartmentservices.dto.response.ClickTrackingReportResponse_V2;
import com.apartmentservices.models.CSClickTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CSClickTrackingRepository extends JpaRepository<CSClickTracking, Long> {
    CSClickTracking findByTypeAndValueId(Integer type, Integer valueID);

    Optional<CSClickTracking> findTopByTypeAndValueIdOrderByLastClickedDesc(int type, int valueId);


//    type = 1 (Category)
    @Query("SELECT new com.apartmentservices.dto.response.ClickTrackingReportResponse(" +
            "COALESCE(ct.type, 1) AS type, " +
            "COALESCE(ct.valueId, c.categoryId) AS valueId, " +
            "c.categoryName AS name, " +
            "COALESCE(ct.clickCount, 0) AS clickCount, " +
            "COALESCE(ct.lastClicked, :defaultDate) AS lastClicked, " +
            "(SELECT COALESCE(SUM(ctPrev.clickCount), 0) " +
            " FROM CSClickTracking ctPrev " +
            " WHERE ctPrev.type = 1 AND ctPrev.valueId = c.categoryId " +
            " AND FUNCTION('YEAR', ctPrev.lastClicked) = :year " +
            " AND FUNCTION('MONTH', ctPrev.lastClicked) = :previousMonth) " +
            ") AS previousMonthClickCount " +
            "FROM Category c " +
            "LEFT JOIN CSClickTracking ct ON ct.type = 1 AND ct.valueId = c.categoryId " +
            "WHERE (ct.type = 1 OR ct.type IS NULL) " +
            "AND (FUNCTION('YEAR', ct.lastClicked) = :year OR ct.lastClicked IS NULL) " +
            "AND (FUNCTION('MONTH', ct.lastClicked) = :month OR ct.lastClicked IS NULL)")
    List<ClickTrackingReportResponse> findClickTrackingReportsByCategory(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("previousMonth") Integer previousMonth,
            @Param("defaultDate") LocalDateTime defaultDate);

//    type = 2 (AdvertisementService)
    @Query("SELECT new com.apartmentservices.dto.response.ClickTrackingReportResponse(" +
            "COALESCE(ct.type, 2) AS type, " +
            "COALESCE(ct.valueId, a.serviceId) AS valueId, " +
            "a.serviceName AS name, " +
            "COALESCE(ct.clickCount, 0) AS clickCount, " +
            "COALESCE(ct.lastClicked, :defaultDate) AS lastClicked, " +
            "(SELECT COALESCE(SUM(ctPrev.clickCount), 0) " +
            " FROM CSClickTracking ctPrev " +
            " WHERE ctPrev.type = 2 AND ctPrev.valueId = a.serviceId " +
            " AND FUNCTION('YEAR', ctPrev.lastClicked) = :year " +
            " AND FUNCTION('MONTH', ctPrev.lastClicked) = :previousMonth) " +
            ") AS previousMonthClickCount " +
            "FROM AdvertisementService a " +
            "LEFT JOIN CSClickTracking ct ON ct.type = 2 AND ct.valueId = a.serviceId " +
            "WHERE (ct.type = 2 OR ct.type IS NULL) " +
            "AND (FUNCTION('YEAR', ct.lastClicked) = :year OR ct.lastClicked IS NULL) " +
            "AND (FUNCTION('MONTH', ct.lastClicked) = :month OR ct.lastClicked IS NULL)")
    List<ClickTrackingReportResponse> findClickTrackingReportsByService(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("previousMonth") Integer previousMonth,
            @Param("defaultDate") LocalDateTime defaultDate);



    @Query("SELECT new com.apartmentservices.dto.response.ClickTrackingReportResponse_V2(" +
            "COALESCE(ct.type, 1) AS type, " +
            "c.imageLink AS imageLink, " +
            "COALESCE(ct.valueId, c.categoryId) AS valueId, " +
            "c.categoryName AS name, " +
            "COALESCE(ct.clickCount, 0) AS clickCount, " +
            "COALESCE(ct.lastClicked, :defaultDate) AS lastClicked, " +
            "(SELECT COALESCE(SUM(ctPrev.clickCount), 0) " +
            " FROM CSClickTracking ctPrev " +
            " WHERE ctPrev.type = 1 AND ctPrev.valueId = c.categoryId " +
            " AND FUNCTION('YEAR', ctPrev.lastClicked) = :year " +
            " AND FUNCTION('MONTH', ctPrev.lastClicked) = :previousMonth) " +
            ") AS previousMonthClickCount " +

            "FROM CSClickTracking ct " +
            "LEFT JOIN Category c ON ct.valueId = c.categoryId " +
            "WHERE ct.type = 1 " +
            "AND (FUNCTION('YEAR', ct.lastClicked) = :year OR ct.lastClicked IS NULL) " +
            "AND (FUNCTION('MONTH', ct.lastClicked) = :month OR ct.lastClicked IS NULL)")
    List<ClickTrackingReportResponse_V2> findClickTrackingReportsByCategory_V2(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("previousMonth") Integer previousMonth,
            @Param("defaultDate") LocalDateTime defaultDate
    );

}