package com.apartmentservices.services;

import com.apartmentservices.dto.response.ClickTrackingReportResponse;
import com.apartmentservices.dto.response.ClickTrackingReportResponse_V2;
import com.apartmentservices.models.CSClickTracking;
import com.apartmentservices.repositories.CSClickTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CSClickTrackingService {
    private final CSClickTrackingRepository csClickTrackingRepository;

    //Version 2
    public CSClickTracking getOrCreateClickTracking_V2(Integer type, Integer valueId) {
        // Lấy bản ghi mới nhất theo type và valueId, sắp xếp theo lastClicked giảm dần
        Optional<CSClickTracking> optionalClickTracking = csClickTrackingRepository.findTopByTypeAndValueIdOrderByLastClickedDesc(type, valueId);

        // Lấy năm và tháng hiện tại
        YearMonth currentYearMonth = YearMonth.now();

        CSClickTracking clickTracking;
        if (optionalClickTracking.isPresent()) {
            clickTracking = optionalClickTracking.get();

            // Lấy năm và tháng của lastClicked
            YearMonth lastClickedYearMonth = YearMonth.from(clickTracking.getLastClicked());

            if (lastClickedYearMonth.equals(currentYearMonth)) {
                // Nếu cùng năm và tháng, tăng click count và cập nhật lastClicked
                clickTracking.incrementClickCount();
                clickTracking.setLastClicked(LocalDateTime.now());
            } else {
                // Nếu khác năm hoặc tháng, tạo bản ghi mới cho năm và tháng hiện tại
                clickTracking = new CSClickTracking();
                clickTracking.setType(type);
                clickTracking.setValueId(valueId);
                clickTracking.setClickCount(1); // Bắt đầu đếm cho tháng mới
                clickTracking.setLastClicked(LocalDateTime.now());
            }
        } else {
            // Trường hợp không tìm thấy bản ghi, tạo bản ghi mới
            clickTracking = new CSClickTracking();
            clickTracking.setType(type);
            clickTracking.setValueId(valueId);
            clickTracking.setClickCount(1);
            clickTracking.setLastClicked(LocalDateTime.now());
        }

        return csClickTrackingRepository.save(clickTracking);
    }


//    Version 1
    public CSClickTracking getOrCreateClickTracking(Integer type, Integer valueId) {
        CSClickTracking clickTracking = csClickTrackingRepository.findByTypeAndValueId(type, valueId);
        if (clickTracking == null) {
            clickTracking = new CSClickTracking();
            clickTracking.setType(type);
            clickTracking.setValueId(valueId);
            clickTracking.setClickCount(1); // Thiết lập click count là 1 khi tạo mới
        } else {
            clickTracking.incrementClickCount(); // Tăng click count nếu đã tồn tại
        }
        return csClickTrackingRepository.save(clickTracking);
    }

    public List<CSClickTracking> getAllClickTrackings() {
        return csClickTrackingRepository.findAll();
    }

    public List<ClickTrackingReportResponse> getClickTrackingReportsByCategory( Integer year, Integer month, Integer previousMonth, LocalDateTime defaultDate) {
        return csClickTrackingRepository.findClickTrackingReportsByCategory(year, month, previousMonth, defaultDate);
    }

    public List<ClickTrackingReportResponse> getClickTrackingReportsByService(Integer year, Integer month, Integer previousMonth, LocalDateTime defaultDate) {
        return csClickTrackingRepository.findClickTrackingReportsByService(year, month, previousMonth, defaultDate);
    }

    public List<ClickTrackingReportResponse_V2> getClickTrackingReportsByCategory_V2( Integer year, Integer month, Integer previousMonth, LocalDateTime defaultDate) {
        return csClickTrackingRepository.findClickTrackingReportsByCategory_V2(year, month, previousMonth, defaultDate);
    }

}
