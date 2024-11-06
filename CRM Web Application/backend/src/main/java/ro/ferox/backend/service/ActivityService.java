package ro.ferox.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ferox.backend.dto.activity.ActivityRequest;
import ro.ferox.backend.dto.activity.ActivityResponse;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Activity;
import ro.ferox.backend.model.Project;
import ro.ferox.backend.model.User;
import ro.ferox.backend.repository.ActivityRepo;
import ro.ferox.backend.repository.ProjectRepo;
import ro.ferox.backend.repository.UserRepo;
import ro.ferox.backend.utils.mapper.ActivityMapper;

import java.util.List;

@Service
public class ActivityService {
    private final ActivityRepo activityRepo;
    private final UserRepo userRepo;
    private final ProjectRepo projectRepo;

    public ActivityService(ActivityRepo activityRepo, UserRepo userRepo, ProjectRepo projectRepo) {
        this.activityRepo = activityRepo;
        this.userRepo = userRepo;
        this.projectRepo = projectRepo;
    }

    @Transactional
    public ActivityResponse save(ActivityRequest activityRequest) throws NotFoundException {
        User user = userRepo.findById(activityRequest.userId())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + activityRequest.userId()));
        Project project = projectRepo.findById(activityRequest.projectId())
                .orElseThrow(() -> new NotFoundException("Project not found with id: " + activityRequest.projectId()));
        Activity activityToSave = new Activity(user, project, activityRequest.startDate(), activityRequest.endDate(), activityRequest.hours(),
                activityRequest.details());
        ActivityResponse savedActivity = ActivityMapper.entityToDto(activityRepo.save(activityToSave));
        project.addHours(activityRequest.hours());
        return savedActivity;
    }

    @Transactional
    public void delete(Long id) throws NotFoundException {
        Activity activity = findById(id);
        activityRepo.delete(activity);
    }

    public Activity findById(Long id) throws NotFoundException {
        return activityRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity not found with id: " + id));
    }

    public List<Activity> getAllActivities() {
        return activityRepo.findAll();
    }

    public List<ActivityResponse> getAllActivityResponses() {
        List<Activity> activities = getAllActivities();
        return ActivityMapper.entityListToDto(activities);
    }

    public List<Activity> getActivitiesByUserId(Long userId) {
        return activityRepo.findAllByUserId(userId);
    }

    public List<ActivityResponse> getAllActivityResponsesByUserId(Long userId) {
        List<Activity> activities = getActivitiesByUserId(userId);
        return ActivityMapper.entityListToDto(activities);
    }

    public List<Activity> getActivitiesByProjectId(Long projectId) {
        return activityRepo.findAllByProjectId(projectId);
    }

    public List<ActivityResponse> getAllActivityResponsesByProjectId(Long projectId) {
        List<Activity> activities = getActivitiesByProjectId(projectId);
        return ActivityMapper.entityListToDto(activities);
    }

}
