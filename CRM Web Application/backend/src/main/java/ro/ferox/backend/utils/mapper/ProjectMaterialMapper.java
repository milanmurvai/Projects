package ro.ferox.backend.utils.mapper;

import org.springframework.stereotype.Component;
import ro.ferox.backend.dto.projectMaterial.ProjectMaterialResponse;
import ro.ferox.backend.model.ProjectMaterial;

import java.util.List;

@Component
public final class ProjectMaterialMapper {
    public static ProjectMaterialResponse entityToDto(ProjectMaterial projectMaterial) {
        return new ProjectMaterialResponse(projectMaterial.getId(), projectMaterial.getProject().getId(),
                projectMaterial.getMaterial().getId(), projectMaterial.getQuantity(), projectMaterial.getTotal());
    }

    public static List<ProjectMaterialResponse> entityListToDto(List<ProjectMaterial> projectMaterials) {
        return projectMaterials.stream()
                .map(ProjectMaterialMapper::entityToDto)
                .toList();
    }
}
