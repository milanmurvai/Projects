package ro.ferox.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.ferox.backend.model.ProjectMaterial;

@Repository
public interface ProjectMaterialRepo extends JpaRepository<ProjectMaterial, Long> {
    int countByMaterialId(Long materialId);
}
