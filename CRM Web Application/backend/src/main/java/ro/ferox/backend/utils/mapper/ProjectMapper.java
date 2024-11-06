package ro.ferox.backend.utils.mapper;

import org.springframework.stereotype.Component;
import ro.ferox.backend.dto.project.ProjectResponse;
import ro.ferox.backend.model.Project;

import java.util.List;

@Component
public final class ProjectMapper {
    public static ProjectResponse entityToDto(Project project) {
        return new ProjectResponse(project.getId(), project.getName(), project.getDescription(),
                project.getClient().getId(), project.getAddress(),
                ProjectMaterialMapper.entityListToDto(project.getMaterials()), project.getHours(),
                project.getPrice(), project.getAdvance(), project.isInvoice(), project.getStatus(),
                project.getStartDate(), project.getLimitDate(), project.getUsers() != null ?
                UserMapper.entityListToDto(project.getUsers()) : null,
                project.getTotalAmount());
    }

    public static List<ProjectResponse> entityListToDto(List<Project> projects) {
        return projects.stream()
                .map(ProjectMapper::entityToDto)
                .toList();
    }
}
