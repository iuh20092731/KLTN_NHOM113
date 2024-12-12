package com.apartmentservices.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/info")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
@Tag(name = "District Controller", description = "APIs for managing district and ward information / Các API để quản lý thông tin quận và phường")
public class DistrictController {

    Map<String, Object> districtData = new HashMap<>();

    @PostConstruct
    public void init() {
        loadDistrictData();
    }

    private void loadDistrictData() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            districtData = objectMapper.readValue(
                    getClass().getClassLoader().getResourceAsStream("districts.json"),
                    new TypeReference<Map<String, Object>>() {}
            );
        } catch (IOException e) {
            log.error("Failed to load district data", e);
            throw new RuntimeException("Failed to load district data", e);
        }
    }

    @GetMapping("/districts")
    @Operation(summary = "Get All Districts", description = "Retrieve a list of all districts / Lấy danh sách tất cả các quận")
    public List<Map<String, String>> getDistricts() {
        List<Map<String, String>> districts = new ArrayList<>();

        // Lặp qua từng tỉnh/thành phố
        for (Object value : districtData.values()) {
            Map<String, Object> cityData = (Map<String, Object>) value;
            Map<String, Object> quans = (Map<String, Object>) cityData.get("Quans");

            // Lặp qua từng quận
            for (Map.Entry<String, Object> entry : quans.entrySet()) {
                Map<String, Object> quan = (Map<String, Object>) entry.getValue();
                districts.add(Map.of("id", quan.get("id").toString(), "name", quan.get("name").toString()));
            }
        }

        return districts;
    }

    @GetMapping("/districts/{districtId}/wards")
    @Operation(summary = "Get Wards by District", description = "Retrieve a list of wards for a specific district / Lấy danh sách các phường cho một quận cụ thể")
    public List<Map<String, String>> getWardsByDistrict(@PathVariable String districtId) {
        List<Map<String, String>> wards = new ArrayList<>();

        for (Object value : districtData.values()) {
            Map<String, Object> cityData = (Map<String, Object>) value;
            Map<String, Object> quans = (Map<String, Object>) cityData.get("Quans");

            // Kiểm tra từng quận
            if (quans.containsKey(districtId)) {
                Map<String, Object> quan = (Map<String, Object>) quans.get(districtId);
                List<Map<String, String>> phuongs = (List<Map<String, String>>) quan.get("phuongs");

                // Lấy thông tin phường
                for (Map<String, String> phuong : phuongs) {
                    wards.add(Map.of("id", phuong.get("id"), "name", phuong.get("name")));
                }
                break; // Dừng lại sau khi tìm thấy quận
            }
        }

        return wards;
    }
}
