package ro.ferox.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ro.ferox.backend.dto.ResponseDto;
import ro.ferox.backend.dto.project.ProjectRequest;
import ro.ferox.backend.dto.project.ProjectResponse;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/projects")
@Validated
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Operation(summary = "Create a new project", description = "This endpoint is used to create a new project." +
            "The details of the project to be created are passed in the request body. " +
            "The response body contains the details of the created project.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectResponse.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid request due to validation errors",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest projectRequest) throws NotFoundException {
        ProjectResponse createdProject = projectService.save(projectRequest);
        return ResponseEntity.ok(createdProject);
    }

    @Operation(summary = "Delete a project", description = "This endpoint is used to delete an existing project.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Project deleted successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "404", description = "The project with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable("projectId") Long projectId) throws NotFoundException {
        projectService.delete(projectId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Edit a project", description = "This endpoint is used to edit an existing project." +
            "The details of the project to be edited are passed in the request body. " +
            "The response body contains the details of the updated project.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project edited successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectResponse.class))}),
            @ApiResponse(responseCode = "404", description = "The project with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid request due to validation errors",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable("projectId") Long projectId,
                                                         @RequestBody ProjectRequest projectRequest) throws NotFoundException {
        ProjectResponse updatedProject = projectService.update(projectRequest, projectId);
        return ResponseEntity.ok(updatedProject);
    }

    @Operation(summary = "Get project with specified name", description = "This endpoint is used to retrieve a project with " +
            "specified name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project found successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectResponse.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/byName/{name}")
    public ResponseEntity<ProjectResponse> getProjectByName(@PathVariable("name") String name) throws NotFoundException {
        ProjectResponse project = projectService.findResponseByName(name);
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "Get project with specified id", description = "This endpoint is used to retrieve a project with " +
            "specified id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project found successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectResponse.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable("projectId") Long projectId) throws NotFoundException {
        ProjectResponse project = projectService.findResponseById(projectId);
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "Get all projects", description = "This endpoint is used to retrieve all projects.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProjectResponse.class)))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjectResponses();
        return ResponseEntity.ok(projects);
    }

    @Operation(summary = "Get all projects by user id", description = "This endpoint is used to retrieve all projects by user id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProjectResponse.class)))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/byUser/{userId}")
    public ResponseEntity<List<ProjectResponse>> getAllProjectsByUserId(@PathVariable("userId") Long userId) {
        List<ProjectResponse> projects = projectService.getAllProjectResponsesByUserId(userId);
        return ResponseEntity.ok(projects);
    }

    @Operation(summary = "Add user to project", description = "This endpoint is used to add a user to a project.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User added to project successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectResponse.class))}),
            @ApiResponse(responseCode = "404", description = "The project with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PutMapping("/{projectId}/addUser/{userId}")
    public ResponseEntity<ProjectResponse> addUserToProject(@PathVariable("projectId") Long projectId,
                                                            @PathVariable("userId") Long userId) throws NotFoundException {
        projectService.addUserToProject(projectId, userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Remove user from project", description = "This endpoint is used to remove a user from a project.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User removed from project successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectResponse.class))}),
            @ApiResponse(responseCode = "404", description = "The project with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PutMapping("/{projectId}/removeUser/{userId}")
    public ResponseEntity<ProjectResponse> removeUserFromProject(@PathVariable("projectId") Long projectId,
                                                                 @PathVariable("userId") Long userId) throws NotFoundException {
        projectService.removeUserFromProject(projectId, userId);
        return ResponseEntity.ok().build();
    }

}
