package com.apartmentservices.repositories;

import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.MainAdvertisement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Primary
@Repository
public interface MainAdvertisementRepository extends JpaRepository<MainAdvertisement, Integer> {

    // Phân trang với điều kiện AdStatus
    Page<MainAdvertisement> findAllByAdStatus(MainAdvertisement.AdStatus adStatus, Pageable pageable);

    List<MainAdvertisement> findByAdvertiser_UserId(String userId);

    List<MainAdvertisement> findByAdvertisementService_ServiceIdOrderByClicksDescViewsDescLikesDescSharedDescSavedDesc(Integer serviceId, Pageable pageable);

    List<MainAdvertisement> findByAdvertisementIdIn(List<Integer> ids);

    @Query(value = "SELECT A.* FROM advertisements A " +
            "LEFT JOIN advertisement_services B ON A.serviceid = B.service_id " +
            "WHERE B.service_id = :serviceId", nativeQuery = true)
    List<MainAdvertisement> findByAdvertisementServiceId(Integer serviceId);

    @Query(value = "SELECT A.* FROM advertisements A " +
            "LEFT JOIN advertisement_services B ON A.serviceid = B.service_id " +
            "WHERE A.ad_status = :status AND B.service_name_no_accent = :serviceName", nativeQuery = true)
    List<MainAdvertisement> findByAdvertisementServiceNameAndStatus(String serviceName, String status);

    @Query(value = "SELECT A.* FROM advertisements A " +
            "LEFT JOIN advertisement_services B ON A.serviceid = B.service_id " +
            "WHERE A.ad_status = :status AND B.service_id = :serviceId ", nativeQuery = true)
    List<MainAdvertisement> findByAdvertisementServiceIdAndStatus(Integer serviceId, String status);

    @Query(value = "SELECT A.* FROM advertisements A " +
            "WHERE A.ad_status = :status  ", nativeQuery = true)
    List<MainAdvertisement> findMainAdvertisementByAdStatus(String status);

    @Query(value = "\n" +
            "SELECT\n" +
            "    r.advertisementid AS adid ,\n" +
            "    COUNT(r.reviewid) AS review_count,\n" +
            "    AVG(r.rating) AS average_rating,\n" +
            "    B.views AS views2,           -- Số lượt xem\n" +
            "    B.clicks AS clicks2,          -- Số lượt click\n" +
            "    B.main_advertisement_name as adname, -- Thông tin khác từ bảng advertisements\n" +
            "    C.service_name,   -- Thông tin từ bảng advertisement_services\n" +
            "    D.category_name,   -- Thông tin từ bảng categories\n" +
            "    B.*\n" +
            "FROM\n" +
            "    reviews r\n" +
            "    LEFT JOIN advertisements B ON r.advertisementid = B.advertisementid\n" +
            "    LEFT JOIN advertisement_services C ON B.serviceid = C.service_id\n" +
            "    LEFT JOIN categories D ON C.categoryid = D.category_id " +
            "WHERE " +
            "    B.ad_status = 'Active' " +
            "GROUP BY " +
            "    r.advertisementid, " +
            "    B.views, " +
            "    B.clicks, " +
            "    B.main_advertisement_name, " +
            "    C.service_name, " +
            "    D.category_name " +
            "ORDER BY " +
            "    review_count DESC, " +    // Sắp xếp theo số lượng review giảm dần
            "    average_rating DESC, " +    // Nếu số lượng review bằng nhau, sắp xếp theo số sao trung bình giảm dần
            "    views2 DESC, " + // Nếu số sao trung bình bằng nhau, sắp xếp theo số lượt xem giảm dần
            "    clicks2 DESC " +
            "", nativeQuery = true)
    List<MainAdvertisement> findTop5FoodAdvertisements(Pageable pageable);

    // Top 3 quán ăn tốt nhất dựa vào rating và số lượt review

//    @Query(value = "WITH AverageRating AS (" +
//            "    SELECT advertisementid, " +
//            "           AVG(rating) AS avg_rating, " +
//            "           COUNT(reviewid) AS review_count " +
//            "    FROM reviews " +
//            "    GROUP BY advertisementid" +
//            ") " +
//            "SELECT a.*, r.avg_rating, r.review_count, am.mediaurl, am.media_name, am.media_type " +
//            "FROM advertisements a " +
//            "JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
//            "LEFT JOIN advertisement_media am ON a.advertisementid = am.advertisementid " +
//            "WHERE a.ad_status = 'Active' " +
//            "ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
//            "LIMIT 3", nativeQuery = true)
            @Query(value = "WITH AverageRating AS (" +
            "    SELECT advertisementid, " +
            "           AVG(rating) AS avg_rating, " +
            "           COUNT(reviewid) AS review_count " +
            "    FROM reviews " +
            "    GROUP BY advertisementid" +
            ") " +
            "SELECT a.*, r.avg_rating, r.review_count " +
            "FROM advertisements a " +
            "JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "WHERE a.ad_status = 'Active' " +
            "ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
            "LIMIT 3", nativeQuery = true)
    List<MainAdvertisement> findTop5BestAdvertisements();

    @Query(value = "WITH AverageRating AS (" +
            "    SELECT advertisementid, " +
            "           AVG(rating) AS avg_rating, " +
            "           COUNT(reviewid) AS review_count " +
            "    FROM reviews " +
            "    GROUP BY advertisementid" +
            ") " +
            "SELECT a.*, r.avg_rating, r.review_count " +
            "FROM advertisements a " +
            "JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "WHERE a.ad_status = 'Active' " +
            "ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
            "LIMIT 3", nativeQuery = true)
    List<MainAdvertisement> findTop3BestAdvertisements_V2();


    @Query(value = "WITH AverageRating AS (" +
            "    SELECT advertisementid, " +
            "           AVG(rating) AS avg_rating, " +
            "           COUNT(reviewid) AS review_count " +
            "    FROM reviews " +
            "    GROUP BY advertisementid" +
            ") " +
            "SELECT a.*, r.avg_rating, r.review_count " +
            "FROM advertisements a " +
            "JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "WHERE a.ad_status = 'Active' " +
            "AND a.serviceid IN (SELECT service_id FROM advertisement_services WHERE categoryid = :categoryId) " +
            "ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
            "LIMIT 3", nativeQuery = true)
    List<MainAdvertisement> findTop3BestAdvertisementsByCategory(@Param("categoryId") int categoryId);


    // Top 5 quán ăn nổi bật dựa vào số lượt click, lượt like, lượt lưu (saved)

//    @Query(value = "WITH AverageRating AS (" +
//            "    SELECT advertisementid, " +
//            "           AVG(rating) AS avg_rating, " +
//            "           COUNT(reviewid) AS review_count " +
//            "    FROM reviews " +
//            "    GROUP BY advertisementid" +
//            "), " +
//            "BestAdvertisements AS (" +
//            "    SELECT a.advertisementid " +
//            "    FROM advertisements a " +
//            "    JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
//            "    WHERE a.ad_status = 'Active' " +
//            "    ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
//            "    LIMIT 5" +
//            ") " +
//            "SELECT a.*, am.mediaurl, am.media_name, am.media_type " +
//            "FROM advertisements a " +
//            "LEFT JOIN advertisement_media am ON a.advertisementid = am.advertisementid " +
//            "WHERE a.ad_status = 'Active' " +
//            "AND a.advertisementid NOT IN (SELECT advertisementid FROM BestAdvertisements) " +
//            "ORDER BY a.clicks DESC, a.likes DESC, a.saved DESC " +
//            "LIMIT 5", nativeQuery = true)
            @Query(value = "WITH AverageRating AS (" +
            "    SELECT advertisementid, " +
            "           AVG(rating) AS avg_rating, " +
            "           COUNT(reviewid) AS review_count " +
            "    FROM reviews " +
            "    GROUP BY advertisementid" +
            "), " +
            "BestAdvertisements AS (" +
            "    SELECT a.advertisementid " +
            "    FROM advertisements a " +
            "    JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "    WHERE a.ad_status = 'Active' " +
            "    ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
            "    LIMIT 5" +
            ") " +
            "SELECT a.* " +
            "FROM advertisements a " +
            "WHERE a.ad_status = 'Active' " +
            "AND a.advertisementid NOT IN (SELECT advertisementid FROM BestAdvertisements) " +
            "ORDER BY a.clicks DESC, a.likes DESC, a.saved DESC " +
            "LIMIT 5", nativeQuery = true)
    List<MainAdvertisement> findTop5PopularAdvertisements();


    @Query(value = "WITH AverageRating AS (" +
            "    SELECT advertisementid, " +
            "           AVG(rating) AS avg_rating, " +
            "           COUNT(reviewid) AS review_count " +
            "    FROM reviews " +
            "    GROUP BY advertisementid" +
            "), " +
            "BestAdvertisements AS (" +
            "    SELECT a.advertisementid " +
            "    FROM advertisements a " +
            "    JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "    JOIN advertisement_services s ON a.serviceid = s.service_id " +
            "    WHERE a.ad_status = 'Active' " +
            "    AND s.categoryid = :categoryId " + // Điều kiện lọc theo categoryId
            "    ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
            "    LIMIT 5" +
            ") " +
            "SELECT a.* " +
            "FROM advertisements a " +
            "JOIN advertisement_services s ON a.serviceid = s.service_id " +
            "WHERE a.ad_status = 'Active' " +
            "AND s.categoryid = :categoryId " + // Điều kiện lọc theo categoryId
            "AND a.advertisementid NOT IN (SELECT advertisementid FROM BestAdvertisements) " +
            "ORDER BY a.clicks DESC, a.likes DESC, a.saved DESC " +
            "LIMIT 5", nativeQuery = true)
    List<MainAdvertisement> findTop5PopularAdvertisementsByCategory(@Param("categoryId") int categoryId);


    @Query(value = "WITH AverageRating AS (" +
            "    SELECT advertisementid, " +
            "           AVG(rating) AS avg_rating, " +
            "           COUNT(reviewid) AS review_count " +
            "    FROM reviews " +
            "    GROUP BY advertisementid" +
            "), " +
            "BestAdvertisements AS (" +
            "    SELECT a.advertisementid " +
            "    FROM advertisements a " +
            "    JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "    WHERE a.ad_status = 'Active' " +
            "    ORDER BY r.avg_rating DESC, r.review_count DESC, a.likes DESC " +
            "    LIMIT 5" +
            ") " +
            "SELECT a.*, r.avg_rating, r.review_count " +
            "FROM advertisements a " +
            "JOIN AverageRating r ON a.advertisementid = r.advertisementid " +
            "WHERE a.ad_status = 'Active'  " +
            "AND a.advertisementid NOT IN (SELECT advertisementid FROM BestAdvertisements) " +
            "ORDER BY a.clicks DESC, a.likes DESC, a.saved DESC " +
            "LIMIT 5", nativeQuery = true)
    List<MainAdvertisement> findTop5PopularAdvertisements_V2();


    Optional<MainAdvertisement> findById(Integer advertisementId);


    @Query(value = "WITH AverageRating AS (\n" +
            "    SELECT a.advertisementid, \n" +
            "           AVG(r.rating) AS avg_rating, \n" +
            "           COUNT(r.reviewid) AS review_count \n" +
            "    FROM advertisements a\n" +
            "    LEFT JOIN reviews r ON a.advertisementid = r.advertisementid\n" +
            "    GROUP BY a.advertisementid\n" +
            "), \n" +
            "BestAdvertisements AS (\n" +
            "    SELECT a.advertisementid \n" +
            "    FROM advertisements a\n" +
            "    JOIN AverageRating ar ON a.advertisementid = ar.advertisementid\n" +
            "    JOIN advertisement_services s ON a.serviceid = s.service_id\n" +
            "    JOIN categories c ON s.categoryid = c.category_id\n" +
            "    WHERE a.ad_status = 'Active' \n" +
            "    AND LOWER(c.category_name_no_diacritics) = LOWER(:categoryNameNoDiacritics)\n" +
            "    ORDER BY ar.avg_rating DESC, ar.review_count DESC, a.likes DESC \n" +
            "    LIMIT 5\n" +
            ") \n" +
            "SELECT a.* \n" +
            "FROM advertisements a\n" +
            "JOIN advertisement_services s ON a.serviceid = s.service_id\n" +
            "JOIN categories c ON s.categoryid = c.category_id\n" +
            "WHERE a.ad_status = 'Active' \n" +
            "AND LOWER(c.category_name_no_diacritics) = LOWER(:categoryNameNoDiacritics)\n" +
            "AND a.advertisementid NOT IN (SELECT advertisementid FROM BestAdvertisements)\n" +
            "ORDER BY a.clicks DESC, a.likes DESC, a.saved DESC \n" +
            "LIMIT 5;\n",
            nativeQuery = true)
    List<MainAdvertisement> findTop5PopularAdvertisementsByCategoryName(@Param("categoryNameNoDiacritics") String categoryNameNoDiacritics);





    @Query(value = "WITH AverageRating AS (" +
            "    SELECT a.advertisementid, " +
            "           AVG(r.rating) AS avg_rating, " +
            "           COUNT(r.reviewid) AS review_count " +
            "    FROM advertisements a " +
            "    LEFT JOIN reviews r ON a.advertisementid = r.advertisementid " +
            "    GROUP BY a.advertisementid " +
            ") " +
            "SELECT a.*, ar.avg_rating, ar.review_count " +
            "FROM advertisements a " +
            "JOIN AverageRating ar ON a.advertisementid = ar.advertisementid " +
            "JOIN advertisement_services aservice ON a.serviceid = aservice.service_id " +
            "JOIN categories category ON aservice.categoryid = category.category_id " +
            "WHERE a.ad_status = 'Active' " +
            "AND LOWER(category.category_name_no_diacritics) LIKE LOWER(CONCAT('%', :categoryNameNoDiacritics, '%')) " +
            "ORDER BY ar.avg_rating DESC, ar.review_count DESC, a.likes DESC " +
            "LIMIT 3",
            nativeQuery = true)
    List<MainAdvertisement> findTop3BestAdvertisementsByCategoryName(@Param("categoryNameNoDiacritics") String categoryNameNoDiacritics);




//    // Tìm tất cả các quảng cáo của một dịch vụ cụ thể
//    List<MainAdvertisement> findByAdvertisementService_ServiceId(Integer serviceId);
//
//    // Tìm tất cả các quảng cáo của một người quảng cáo cụ thể
//    List<MainAdvertisement> findByAdvertiser_UserId(Integer advertiserId);
//
//    // Tìm tất cả các quảng cáo của một admin cụ thể
//    List<MainAdvertisement> findByAdmin_UserId(Integer adminId);
//
//    // Tìm tất cả các quảng cáo theo trạng thái
//    List<MainAdvertisement> findByAdStatus(MainAdvertisement.AdStatus adStatus);
//
//    // Tìm quảng cáo theo khoảng giá
//    List<MainAdvertisement> findByPriceRangeLowGreaterThanEqualAndPriceRangeHighLessThanEqual(BigDecimal low, BigDecimal high);
//
//    // Tìm quảng cáo theo khoảng thời gian
//    List<MainAdvertisement> findByAdStartDateGreaterThanEqualAndAdEndDateLessThanEqual(LocalDateTime startDate, LocalDateTime endDate);
//
//    // Tìm quảng cáo theo địa chỉ
//    List<MainAdvertisement> findByAddressContaining(String address);

    @Query("SELECT a FROM MainAdvertisement a WHERE " +
            "LOWER(a.mainAdvertisementName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.detailedDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MainAdvertisement> searchByKeyword(String keyword);

    @Query("SELECT COUNT(a) FROM MainAdvertisement a WHERE a.adStatus = :adStatus AND a.adStartDate BETWEEN :startDate AND :endDate")
    Long findActiveAdsBetweenDates(
            @Param("adStatus") MainAdvertisement.AdStatus adStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

//    // Truy vấn số lượng quảng cáo đang hoạt động trong một tháng của năm hiện tại
//    @Query("SELECT COUNT(a) FROM MainAdvertisement a " +
//            "WHERE a.adStatus = 'Active' " +
//            "AND a.adStartDate <= :endOfMonth " +
//            "AND a.adEndDate >= :startOfMonth")
//    Long countActiveAdvertisementsInMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    @Query("SELECT COUNT(a) FROM MainAdvertisement a " +
            "WHERE a.adStatus = 'Active' " +
            "AND a.adStartDate <= :endOfMonth " +
            "AND a.adEndDate >= :startOfMonth")
    Long countActiveAdvertisementsInMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);


    @Query("SELECT COUNT(a) FROM MainAdvertisement a WHERE a.adStartDate >= :startDate AND a.adEndDate <= :endDate")
    public Long countActiveAdvertisements(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
