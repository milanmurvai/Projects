package ro.ferox.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "activity")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the activity")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @Schema(description = "The user of the activity")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    @Schema(description = "The project of the activity")
    private Project project;

    @Column(nullable = false)
    @Schema(description = "The start date of the activity")
    @JoinColumn(name = "start_date")
    private LocalDate startDate;

    @Column(nullable = false)
    @Schema(description = "The end date of the activity")
    @JoinColumn(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    @Schema(description = "The number of hours worked")
    private double hours;

    @Schema(description = "The details of the activity")
    private String details;

    public Activity(User user, Project project, LocalDate startDate, LocalDate endDate, double hours, String details) {
        this.user = user;
        this.project = project;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hours = hours;
        this.details = details;
    }
}
