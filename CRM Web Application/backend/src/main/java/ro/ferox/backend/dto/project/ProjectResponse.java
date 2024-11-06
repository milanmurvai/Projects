package ro.ferox.backend.dto.project;

import io.swagger.v3.oas.annotations.media.Schema;
import ro.ferox.backend.dto.projectMaterial.ProjectMaterialResponse;
import ro.ferox.backend.dto.user.UserResponse;
import ro.ferox.backend.model.enums.Status;

import java.time.LocalDate;
import java.util.List;

public record ProjectResponse(
        @Schema(description = "The id of the project")
        Long id,
        @Schema(description = "The name of the project (required)")
        String name,
        @Schema(description = "The description of the project (required)")
        String description,
        @Schema(description = "The id of the client of the project")
        Long clientId,
        @Schema(description = "The address of the project (required)")
        String address,
        @Schema(description = "The materials and their quantity used for the project")
        List<ProjectMaterialResponse> materials,
        @Schema(description = "The number of hours worked on the project")
        double hours,
        @Schema(description = "The price of the project (required)")
        int price,
        @Schema(description = "The payment made in advance for the project (required)")
        int advance,
        @Schema(description = "True/false if an invoice was issued for the project")
        boolean invoice,
        @Schema(description = "The status of the project")
        Status status,
        @Schema(description = "The start date of the project")
        LocalDate startDate,
        @Schema(description = "The limit date of the project")
        LocalDate limitDate,
        @Schema(description = "The users of the project")
        List<UserResponse> users,
        @Schema(description = "The total price of the materials of the project")
        double total
) {
    public ProjectResponse(Long id, String name, String description, Long clientId, String address,
                           List<ProjectMaterialResponse> materials, double hours, int price, int advance, boolean invoice,
                           Status status, LocalDate startDate, LocalDate limitDate, List<UserResponse> users, double total) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.clientId = clientId;
        this.address = address;
        this.materials = materials;
        this.hours = hours;
        this.price = price;
        this.advance = advance;
        this.invoice = invoice;
        this.status = status;
        this.startDate = startDate;
        this.limitDate = limitDate;
        this.users = users;
        this.total = total;
    }
}
