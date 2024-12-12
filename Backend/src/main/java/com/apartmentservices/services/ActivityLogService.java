package com.apartmentservices.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.models.ActivityLog;
import com.apartmentservices.repositories.ActivityLogRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ActivityLogService {

    ActivityLogRepository activityLogRepository;

    @Transactional
    public ActivityLog createActivityLog(ActivityLog activityLog) {
        try {
            return activityLogRepository.save(activityLog);
        } catch (Exception e) {
            log.error("Error creating ActivityLog", e);
            throw new AppException(ErrorCode.ACTIVITY_LOG_CREATION_FAILED);
        }
    }

    public ActivityLog getActivityLog(Integer logId) {
        return activityLogRepository.findById(logId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_LOG_NOT_FOUND));
    }

    public List<ActivityLog> getAllActivityLogs() {
        return activityLogRepository.findAll();
    }

    @Transactional
    public ActivityLog updateActivityLog(Integer logId, ActivityLog updatedActivityLog) {
        return activityLogRepository.findById(logId)
                .map(activityLog -> {
                    activityLog.setAction(updatedActivityLog.getAction());
                    activityLog.setActionDetails(updatedActivityLog.getActionDetails());
                    activityLog.setActionDate(updatedActivityLog.getActionDate());
                    return activityLogRepository.save(activityLog);
                })
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_LOG_NOT_FOUND));
    }

    @Transactional
    public void deleteActivityLog(Integer logId) {
        if (!activityLogRepository.existsById(logId)) {
            throw new AppException(ErrorCode.ACTIVITY_LOG_NOT_FOUND);
        }
        try {
            activityLogRepository.deleteById(logId);
        } catch (Exception e) {
            log.error("Error deleting ActivityLog", e);
            throw new AppException(ErrorCode.ACTIVITY_LOG_DELETION_FAILED);
        }
    }
}

