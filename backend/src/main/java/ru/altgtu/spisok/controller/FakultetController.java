package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.dto.FakultetCardDto;
import ru.altgtu.spisok.repository.FakultetRepository;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FakultetController {

    private final FakultetRepository fakultetRepository;

    @GetMapping("/vuz/{vuzId}/fakultety")
    public List<FakultetCardDto> getFakultetyByVuz(@PathVariable Integer vuzId) {
        List<FakultetRepository.FakultetStatsProjection> projections =
                fakultetRepository.findFakultetStatsByVuzId(vuzId);

        return projections.stream().map(p -> {
            FakultetCardDto dto = new FakultetCardDto();
            dto.setId(p.getId());
            dto.setShortName(p.getShortName());
            dto.setFullName(p.getFullName());
            dto.setImageUrl(p.getImageUrl());

            FakultetCardDto.Stats bachelor = new FakultetCardDto.Stats();
            bachelor.setDirections(p.getBachelorDirections());
            bachelor.setBudgetPlaces(p.getBachelorBudgetPlaces());
            bachelor.setPaidPlaces(p.getBachelorPaidPlaces());
            bachelor.setMinPrice(p.getBachelorMinPrice());
            dto.setBachelor(bachelor);

            FakultetCardDto.Stats master = new FakultetCardDto.Stats();
            master.setDirections(p.getMasterDirections());
            master.setBudgetPlaces(p.getMasterBudgetPlaces());
            master.setPaidPlaces(p.getMasterPaidPlaces());
            master.setMinPrice(p.getMasterMinPrice());
            dto.setMaster(master);

            return dto;
        }).toList();
    }
}