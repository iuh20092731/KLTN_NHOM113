package com.apartmentservices.repositories;

import com.apartmentservices.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // Tìm tất cả các đánh giá của một quảng cáo cụ thể
    List<Review> findByAdvertisement_AdvertisementId(Integer advertisementId);

    @Query(value = "SELECT R.*, A.advertisementId FROM reviews R " +
            "LEFT JOIN advertisements A ON R.advertisementId = A.advertisementId " +
            "WHERE A.advertisementId = :advertisementId " +
            "order by R.review_Date DESC ", nativeQuery = true)
    List<Review> findByAdvertisementId(Integer advertisementId);

//    @Query(value = "SELECT R.*, A.advertisementId FROM reviews R " +
//            "LEFT JOIN advertisements A ON R.advertisementId = A.advertisementId " +
//            "WHERE A.advertisementId = :advertisementId " +
//            "ORDER BY R.reviewDate LIMIT :size OFFSET :offset", nativeQuery = true)
//    List<Review> findReviewsByAdvertisementIdWithPagination(Integer advertisementId, int size, int offset);


    @Query(value = "SELECT * FROM reviews R WHERE R.advertisementId = :advertisementId ORDER BY R.review_Date DESC LIMIT :limit OFFSET :offset ", nativeQuery = true)
    List<Review> findPaginatedByAdvertisementId(@Param("advertisementId") Integer advertisementId, @Param("limit") int limit, @Param("offset") int offset);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.advertisement.advertisementId = :advertisementId")
    Long countByAdvertisementId(@Param("advertisementId") Integer advertisementId);



    @Query(value = "SELECT * FROM reviews R WHERE R.advertisementId = :advertisementId ORDER BY R.review_date DESC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Review> findReviewsByAdvertisementIdWithPagination(@Param("advertisementId") Integer advertisementId, @Param("limit") int limit, @Param("offset") int offset);

    // Để biết tổng số lượng reviews
    @Query(value = "SELECT COUNT(*) FROM reviews WHERE advertisementId = :advertisementId", nativeQuery = true)
    int countReviewsByAdvertisementId(@Param("advertisementId") Integer advertisementId);


    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.advertisement.advertisementId = :advertisementId")
    BigDecimal findAverageRatingByAdvertisementId(@Param("advertisementId") Integer advertisementId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = 1 AND r.advertisement.advertisementId = :advertisementId")
    Long countOneStarReviewsByAdvertisementId(@Param("advertisementId") Integer advertisementId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = 2 AND r.advertisement.advertisementId = :advertisementId")
    Long countTwoStarReviewsByAdvertisementId(@Param("advertisementId") Integer advertisementId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = 3 AND r.advertisement.advertisementId = :advertisementId")
    Long countThreeStarReviewsByAdvertisementId(@Param("advertisementId") Integer advertisementId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = 4 AND r.advertisement.advertisementId = :advertisementId")
    Long countFourStarReviewsByAdvertisementId(@Param("advertisementId") Integer advertisementId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = 5 AND r.advertisement.advertisementId = :advertisementId")
    Long countFiveStarReviewsByAdvertisementId(@Param("advertisementId") Integer advertisementId);

    // Đếm số lượng đánh giá theo số sao cho một quảng cáo cụ thể
    @Query("SELECT COUNT(r) FROM Review r WHERE r.advertisement.advertisementId = :advertisementId AND r.rating = :rating")
    Long countReviewsByRating(Integer advertisementId, Integer rating);
}
