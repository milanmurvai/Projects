package ro.ferox.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ferox.backend.dto.project.ProjectRequest;
import ro.ferox.backend.dto.project.ProjectResponse;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Client;
import ro.ferox.backend.model.Material;
import ro.ferox.backend.model.Project;
import ro.ferox.backend.model.ProjectMaterial;
import ro.ferox.backend.repository.ClientRepo;
import ro.ferox.backend.repository.MaterialRepo;
import ro.ferox.backend.repository.ProjectRepo;
import ro.ferox.backend.repository.UserRepo;
import ro.ferox.backend.utils.mapper.ProjectMapper;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;
    private final ClientRepo clientRepo;
    private final MaterialRepo materialRepo;

    public ProjectService(ProjectRepo projectRepo, UserRepo userRepo, ClientRepo clientRepo, MaterialRepo materialRepo) {
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
        this.clientRepo = clientRepo;
        this.materialRepo = materialRepo;
    }

    @Transactional
    public ProjectResponse save(ProjectRequest projectRequest) throws NotFoundException {
        Client client = clientRepo.findById(projectRequest.clientId())
                .orElseThrow(() -> new NotFoundException("Client not found with id: " + projectRequest.clientId()));
        Project projectToSave = new Project(projectRequest.name(), projectRequest.description(), client,
                projectRequest.address(), projectRequest.price(), projectRequest.advance(), projectRequest.invoice(),
                projectRequest.status(), projectRequest.startDate(), projectRequest.limitDate());
        List<ProjectMaterial> projectMaterials = projectRequest.materials().stream()
                .map(projectMaterial -> {
                    Material material = materialRepo.findById(projectMaterial.materialId())
                            .orElseThrow(() -> new RuntimeException("Material not found"));
                    return new ProjectMaterial(projectToSave, material, projectMaterial.quantity());
                })
                .toList();
        projectToSave.setMaterials(projectMaterials);
        return ProjectMapper.entityToDto(projectRepo.save(projectToSave));
    }


    @Transactional
    public void delete(Long id) throws NotFoundException {
        Project project = findById(id);
        projectRepo.delete(project);
    }

    public Project findById(Long id) throws NotFoundException {
        return projectRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Project not found with id: " + id));
    }

    public Project findByName(String name) throws NotFoundException {
        return projectRepo.findByName(name)
                .orElseThrow(() -> new NotFoundException("Project not found with name: " + name));
    }

    public ProjectResponse findResponseByName(String username) throws NotFoundException {
        return ProjectMapper.entityToDto(findByName(username));
    }

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    public List<ProjectResponse> getAllProjectResponses() {
        List<Project> projects = getAllProjects();
        return ProjectMapper.entityListToDto(projects);
    }

    @Transactional
    public ProjectResponse update(ProjectRequest projectRequest, Long projectId) throws NotFoundException {
        Project projectToUpdate = findById(projectId);

        projectToUpdate.setName(projectRequest.name());
        projectToUpdate.setDescription(projectRequest.description());
        projectToUpdate.setClient(clientRepo.findById(projectRequest.clientId())
                .orElseThrow(() -> new NotFoundException("Client not found with id: " + projectRequest.clientId())));
        projectToUpdate.setAddress(projectRequest.address());

        projectToUpdate.getMaterials().clear();
        projectRequest.materials().forEach(projectMaterial -> {
            Material material;
            try {
                material = materialRepo.findById(projectMaterial.materialId())
                        .orElseThrow(() -> new NotFoundException("Material not found with id: " + projectMaterial.materialId()));
            } catch (NotFoundException e) {
                throw new RuntimeException(e);
            }
            ProjectMaterial newProjectMaterial = new ProjectMaterial(projectToUpdate, material, projectMaterial.quantity());
            projectToUpdate.addMaterial(newProjectMaterial); // This handles bidirectional association
        });

        projectToUpdate.setPrice(projectRequest.price());
        projectToUpdate.setAdvance(projectRequest.advance());
        projectToUpdate.setInvoice(projectRequest.invoice());
        projectToUpdate.setStatus(projectRequest.status());
        projectToUpdate.setStartDate(projectRequest.startDate());
        projectToUpdate.setLimitDate(projectRequest.limitDate());

        return ProjectMapper.entityToDto(projectRepo.save(projectToUpdate));
    }


    public ProjectResponse findResponseById(Long projectId) throws NotFoundException {
        return ProjectMapper.entityToDto(findById(projectId));
    }

    @Transactional
    public void addUserToProject(Long projectId, Long userId) throws NotFoundException {
        Project project = findById(projectId);
        project.addUser(userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId)));
    }

    @Transactional
    public void removeUserFromProject(Long projectId, Long userId) throws NotFoundException {
        Project project = findById(projectId);
        project.removeUser(userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId)));
    }

    public List<ProjectResponse> getAllProjectResponsesByUserId(Long userId) {
        List<Project> projects = projectRepo.findAllByUserId(userId);
        return ProjectMapper.entityListToDto(projects);
    }
}
