package ro.ferox.backend.dto.projectMaterial;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ProjectMaterialRequest(
        @Schema(description = "The id of the material")
        @NotNull(message = "Material id cannot be null")
        Long materialId,
        @Schema(description = "The quantity of the material")
        @NotNull(message = "Quantity cannot be null")
        double quantity
) {
    public ProjectMaterialRequest(Long materialId, double quantity) {
        this.materialId = materialId;
        this.quantity = quantity;
    }
}

