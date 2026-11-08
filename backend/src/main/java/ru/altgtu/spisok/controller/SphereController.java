package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.dto.SphereDto;
import ru.altgtu.spisok.entity.Sphere;
import ru.altgtu.spisok.repository.NapravlenieRepository;
import ru.altgtu.spisok.repository.SphereRepository;
import ru.altgtu.spisok.dto.ProfessionDto;
import ru.altgtu.spisok.repository.ProfessionRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/spheres")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SphereController {

    private final SphereRepository sphereRepository;
    private final ProfessionRepository professionRepository;
    private final NapravlenieRepository napravlenieRepository;

    @GetMapping("/with-counts")
    public List<Map<String, Object>> getWithCounts() {
        return sphereRepository.findAllWithCounts().stream().map(p -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("name", p.getName());
            item.put("opisanie", p.getOpisanie());
            item.put("logoUrl", p.getLogoUrl());
            item.put("count", p.getCnt() != null ? p.getCnt() : 0L);          // специальности
            item.put("profCount", p.getProfCnt() != null ? p.getProfCnt() : 0L); // 👈 профессии
            return item;
        }).toList();
    }

    @GetMapping
    public List<SphereDto> getAll() {
        return sphereRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public SphereDto getById(@PathVariable Integer id) {
        Sphere s = sphereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сфера не найдена: " + id));
        return toDto(s);
    }

    @GetMapping("/{sphereId}/professions")
    public List<ProfessionDto> getProfessionsBySphere(@PathVariable Integer sphereId) {
        return professionRepository.findProfessionsBySphereId(sphereId).stream()
                .map(p -> {
                    ProfessionDto dto = new ProfessionDto();
                    dto.setId(p.getId());
                    dto.setName(p.getName());
                    dto.setDescription(p.getDescription());

                    // Считаем количество уникальных специальностей для этой профессии
                    dto.setSpecialtyCount(napravlenieRepository.countSpecialtiesByProfessionId(p.getId()));

                    return dto;
                })
                .toList();
    }

    private SphereDto toDto(Sphere s) {
        SphereDto dto = new SphereDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setOpisanie(s.getOpisanie());
        dto.setLogoUrl(s.getLogoUrl());
        return dto;
    }
}