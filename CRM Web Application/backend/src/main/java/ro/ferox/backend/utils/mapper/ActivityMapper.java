package ro.ferox.backend.utils.mapper;

import org.springframework.stereotype.Component;
import ro.ferox.backend.dto.activity.ActivityResponse;
import ro.ferox.backend.model.Activity;

import java.util.List;

@Component
public final class ActivityMapper {
    public static ActivityResponse entityToDto(Activity activity) {
        return new ActivityResponse(activity.getId(), activity.getUser().getId(), activity.getProject().getId(),
                activity.getStartDate(), activity.getEndDate(), activity.getHours(), activity.getDetails());
    }

    public static List<ActivityResponse> entityListToDto(List<Activity> activities) {
        return activities.stream()
                .map(ActivityMapper::entityToDto)
                .toList();
    }
}
