package ro.ferox.backend.dto.project;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ro.ferox.backend.dto.projectMaterial.ProjectMaterialRequest;
import ro.ferox.backend.model.enums.Status;

import java.time.LocalDate;
import java.util.List;

public record ProjectRequest(
        @Schema(description = "The name of the project (required)")
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 3, max = 64, message = "Name must be between 3 and 64 characters")
        String name,
        @Schema(description = "The description of the project (required)")
        @NotBlank(message = "Description cannot be blank")
        @Size(min = 3, max = 64, message = "Description must be between 3 and 64 characters")
        String description,
        @Schema(description = "The id of the client of the project")
        @NotNull(message = "Client id cannot be null")
        Long clientId,
        @Schema(description = "The address of the project (required)")
        @NotBlank(message = "Address cannot be null")
        String address,
        @Schema(description = "The materials and their quantity used for the project")
        List<ProjectMaterialRequest> materials,
        @Schema(description = "The price of the project (required)")
        @NotNull(message = "Price cannot be null")
        int price,
        @Schema(description = "The payment made in advance for the project (required)")
        @NotNull(message = "Advance cannot be null")
        int advance,
        @Schema(description = "True/false if an invoice was issued for the project")
        @NotNull(message = "Invoice cannot be null")
        boolean invoice,
        @Schema(description = "The status of the project")
        @NotNull(message = "Status cannot be null")
        Status status,
        @Schema(description = "The start date of the project")
        @NotNull(message = "Start date cannot be null")
        LocalDate startDate,
        @Schema(description = "The limit date of the project")
        LocalDate limitDate
) {
    public ProjectRequest(String name, String description, Long clientId, String address,
                          List<ProjectMaterialRequest> materials, int price, int advance, boolean invoice,
                          Status status, LocalDate startDate, LocalDate limitDate) {
        this.name = name;
        this.description = description;
        this.clientId = clientId;
        this.address = address;
        this.materials = materials;
        this.price = price;
        this.advance = advance;
        this.invoice = invoice;
        this.status = status;
        this.startDate = startDate;
        this.limitDate = limitDate;
    }
}
