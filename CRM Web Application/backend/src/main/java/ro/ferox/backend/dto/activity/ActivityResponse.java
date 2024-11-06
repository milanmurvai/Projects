package ro.ferox.backend.dto.activity;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public record ActivityResponse(
        @Schema(description = "The id of the activity")
        Long id,
        @Schema(description = "The id of the user of the activity")
        Long userId,
        @Schema(description = "The id of the project of the activity")
        Long projectId,
        @Schema(description = "The start date of the activity")
        LocalDate startDate,
        @Schema(description = "The end date of the activity")
        LocalDate endDate,
        @Schema(description = "The hours of the activity")
        double hours,
        @Schema(description = "The details of the activity")
        String details
) {
    public ActivityResponse(Long id, Long userId, Long projectId, LocalDate startDate, LocalDate endDate, double hours, String details) {
        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hours = hours;
        this.details = details;
    }
}
