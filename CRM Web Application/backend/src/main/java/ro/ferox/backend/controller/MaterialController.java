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
import ro.ferox.backend.dto.material.MaterialRequest;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Material;
import ro.ferox.backend.service.MaterialService;

import java.util.List;

@RestController
@RequestMapping("/materials")
@Validated
public class MaterialController {

    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @Operation(summary = "Create a new material", description = "This endpoint is used to create a new material." +
            "The details of the material to be created are passed in the request body. " +
            "The response body contains the details of the created material.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Material created successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Material.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid request due to validation errors",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PostMapping
    public ResponseEntity<Material> createMaterial(@Valid @RequestBody MaterialRequest materialRequest) {
        Material createdMaterial = materialService.save(materialRequest);
        return ResponseEntity.ok(createdMaterial);
    }

    @Operation(summary = "Delete a material", description = "This endpoint is used to delete an existing material.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Material deleted successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "404", description = "The material with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @DeleteMapping("/{materialId}")
    public ResponseEntity<?> deleteMaterial(@PathVariable("materialId") Long materialId) throws NotFoundException {
        materialService.delete(materialId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get material with specified name", description = "This endpoint is used to retrieve a material with " +
            "specified name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Material found successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Material.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/{name}")
    public ResponseEntity<Material> getMaterialByName(@PathVariable("name") String name) throws NotFoundException {
        Material material = materialService.findByName(name);
        return ResponseEntity.ok(material);
    }

    @Operation(summary = "Get all materials", description = "This endpoint is used to retrieve all materials.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Materials found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Material.class)))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        List<Material> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }
}