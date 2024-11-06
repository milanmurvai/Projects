package ro.ferox.backend.dto.projectMaterial;

import io.swagger.v3.oas.annotations.media.Schema;

public record ProjectMaterialResponse(
        @Schema(description = "The id of the project material")
        Long id,
        @Schema(description = "The id of the project")
        Long projectId,
        @Schema(description = "The id of the material")
        Long materialId,
        @Schema(description = "The quantity of the material")
        double quantity,
        @Schema(description = "The total price of the material")
        double total
) {
    public ProjectMaterialResponse(Long id, Long projectId, Long materialId, double quantity, double total) {
        this.id = id;
        this.projectId = projectId;
        this.materialId = materialId;
        this.quantity = quantity;
        this.total = total;
    }
}

