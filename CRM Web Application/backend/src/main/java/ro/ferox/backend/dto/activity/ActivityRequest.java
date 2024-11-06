package ro.ferox.backend.dto.activity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ActivityRequest(
        @Schema(description = "The id of the user of the activity")
        @NotNull(message = "User id cannot be null")
        Long userId,
        @Schema(description = "The id of the project of the activity")
        @NotNull(message = "Project id cannot be null")
        Long projectId,
        @Schema(description = "The start date of the activity")
        @NotNull(message = "Start date cannot be null")
        LocalDate startDate,
        @Schema(description = "The end date of the activity")
        @NotNull(message = "End date cannot be null")
        LocalDate endDate,
        @Schema(description = "The hours of the activity")
        @NotNull(message = "Hours cannot be null")
        double hours,
        @Schema(description = "The details of the activity")
        String details
) {
    public ActivityRequest(Long userId, Long projectId, LocalDate startDate, LocalDate endDate, double hours, String details) {
        this.userId = userId;
        this.projectId = projectId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hours = hours;
        this.details = details;
    }
}
