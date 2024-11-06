package ro.ferox.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ferox.backend.dto.material.MaterialRequest;
import ro.ferox.backend.exception.DeletionException;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Material;
import ro.ferox.backend.repository.MaterialRepo;
import ro.ferox.backend.repository.ProjectMaterialRepo;

import java.util.List;

@Service
public class MaterialService {
    private final MaterialRepo materialRepo;
    private final ProjectMaterialRepo projectMaterialRepo;

    public MaterialService(MaterialRepo materialRepo, ProjectMaterialRepo projectMaterialRepo) {
        this.materialRepo = materialRepo;
        this.projectMaterialRepo = projectMaterialRepo;
    }

    @Transactional
    public Material save(MaterialRequest materialRequest) {
        Material materialToSave = new Material(materialRequest.name(), materialRequest.coefficient());
        return materialRepo.save(materialToSave);
    }


    @Transactional
    public void delete(Long id) throws NotFoundException {
        Material material = findById(id);
        if (projectMaterialRepo.countByMaterialId(material.getId()) > 0) {
            throw new DeletionException("Materialul nu poate fi sters deoarece este folosit in proiecte.");
        }
        materialRepo.delete(material);
    }

    public Material findById(Long id) throws NotFoundException {
        return materialRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Material not found with id: " + id));
    }

    public Material findByName(String name) throws NotFoundException {
        return materialRepo.findByName(name)
                .orElseThrow(() -> new NotFoundException("Material not found with name: " + name));
    }

    public List<Material> getAllMaterials() {
        return materialRepo.findAll();
    }
}
