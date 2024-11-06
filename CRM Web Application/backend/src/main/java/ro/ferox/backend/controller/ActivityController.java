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
import ro.ferox.backend.dto.activity.ActivityRequest;
import ro.ferox.backend.dto.activity.ActivityResponse;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.service.ActivityService;

import java.util.List;

@RestController
@RequestMapping("/activities")
@Validated
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @Operation(summary = "Create a new activity", description = "This endpoint is used to create a new activity." +
            "The details of the activity to be created are passed in the request body. " +
            "The response body contains the details of the created activity.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Activity created successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ActivityResponse.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid request due to validation errors",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest activityRequest) throws NotFoundException {
        ActivityResponse createdActivity = activityService.save(activityRequest);
        return ResponseEntity.ok(createdActivity);
    }

    @Operation(summary = "Delete an activity", description = "This endpoint is used to delete an existing activity.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Activity deleted successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "404", description = "The activity with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @DeleteMapping("/{activityId}")
    public ResponseEntity<?> deleteActivity(@PathVariable("activityId") Long activityId) throws NotFoundException {
        activityService.delete(activityId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get all activities", description = "This endpoint is used to retrieve all activities.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Activities found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ActivityResponse.class)))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getAllActivities() {
        List<ActivityResponse> activities = activityService.getAllActivityResponses();
        return ResponseEntity.ok(activities);
    }

    @Operation(summary = "Get activities by user id", description = "This endpoint is used to retrieve all activities " +
            "by user id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Activities found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ActivityResponse.class)))}),
            @ApiResponse(responseCode = "404", description = "The user with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/forUser/{userId}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByUserId(@PathVariable("userId") Long userId) {
        List<ActivityResponse> activities = activityService.getAllActivityResponsesByUserId(userId);
        return ResponseEntity.ok(activities);
    }

    @Operation(summary = "Get activities by project id", description = "This endpoint is used to retrieve all activities " +
            "by project id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Activities found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ActivityResponse.class)))}),
            @ApiResponse(responseCode = "404", description = "The project with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/forProject/{projectId}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByProjectId(@PathVariable("projectId") Long projectId) {
        List<ActivityResponse> activities = activityService.getAllActivityResponsesByProjectId(projectId);
        return ResponseEntity.ok(activities);
    }
}
