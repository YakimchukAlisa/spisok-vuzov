package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.dto.NapravlenieDto;
import ru.altgtu.spisok.dto.PostInfoDto;
import ru.altgtu.spisok.dto.ProfileDto;
import ru.altgtu.spisok.dto.TrebExamDto;
import ru.altgtu.spisok.entity.*;
import ru.altgtu.spisok.repository.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class NapravlenieController {

    private final NapravlenieRepository napravlenieRepository;
    private final ProfileRepository profileRepository;
    private final IspitaniaRepository ispitaniaRepository;
    private final TrebExamRepository trebExamRepository;
    private final PostInfoRepository postInfoRepository;

    // 1. Получить все направления для конкретного вуза (СО СТАТИСТИКОЙ)
    //    ВСЕГО 3 запроса к БД (вместо сотен)
    @GetMapping("/vuz/{vuzId}/napravleniya")
    public List<NapravlenieDto> getNapravleniyaByVuz(@PathVariable Integer vuzId) {
        // 1. Направления с общей статистикой
        List<NapravlenieRepository.NapravlenieStatsProjection> napravleniya =
                napravlenieRepository.findNapravleniyaWithStatsByVuzId(vuzId);

        // 2. Экзамены (ЕГЭ) — один запрос, группируем по ID направления
        Map<Integer, List<String>> examsByNapravlenie = napravlenieRepository.findExamsByVuzId(vuzId).stream()
                .collect(Collectors.groupingBy(
                        NapravlenieRepository.NapravlenieExamProjection::getNapravlenieId,
                        Collectors.mapping(NapravlenieRepository.NapravlenieExamProjection::getExamName, Collectors.toList())
                ));

        // 3. Профили со статистикой — один запрос, группируем по ID направления
        Map<Integer, List<NapravlenieDto.ProfileStats>> profilesByNapravlenie =
                napravlenieRepository.findProfileStatsByVuzId(vuzId).stream()
                        .collect(Collectors.groupingBy(
                                NapravlenieRepository.ProfileStatsForVuzProjection::getNapravlenieId,
                                Collectors.mapping(this::toProfileStats, Collectors.toList())
                        ));

        // 4. Собираем DTO из мап без дополнительных запросов
        return napravleniya.stream()
                .map(p -> {
                    NapravlenieDto dto = new NapravlenieDto();
                    dto.setId(p.getId());
                    dto.setKod(p.getKod());
                    dto.setName(p.getName());
                    dto.setOpisanie(p.getOpisanie());
                    dto.setFakultetId(p.getFakultetId());
                    dto.setFakultet(p.getFakultet());
                    dto.setUroven(p.getUroven());
                    dto.setExams(examsByNapravlenie.getOrDefault(p.getId(), List.of()));
                    dto.setProfiles(profilesByNapravlenie.getOrDefault(p.getId(), List.of()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Преобразование проекции профиля в DTO
    private NapravlenieDto.ProfileStats toProfileStats(NapravlenieRepository.ProfileStatsForVuzProjection proj) {
        NapravlenieDto.ProfileStats ps = new NapravlenieDto.ProfileStats();
        ps.setId(proj.getProfileId());
        ps.setName(proj.getProfileName());
        ps.setForma(proj.getForma());
        ps.setSrokObuchMes(proj.getSrokObuchMes() != null ? proj.getSrokObuchMes() : 0);
        ps.setBudgetPlaces(proj.getBudgetPlaces());
        ps.setBudgetMinScore(proj.getBudgetMinScore());
        ps.setPaidPlaces(proj.getPaidPlaces());
        ps.setPaidMinScore(proj.getPaidMinScore());
        ps.setPaidMinPrice(proj.getPaidMinPrice());
        return ps;
    }

    // 2. Получить все профили для конкретного направления
    @GetMapping("/napravlenie/{id}/profili")
    public List<ProfileDto> getProfiliByNapravlenie(@PathVariable Integer id) {
        return profileRepository.findByNapravlenieId(id).stream()
                .map(this::toProfileDto)
                .toList();
    }

    private ProfileDto toProfileDto(Profile p) {
        ProfileDto dto = new ProfileDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSrokObuchMes(p.getSrokObuchMes());
        if (p.getFormObuch() != null) {
            dto.setForma(p.getFormObuch().getName());
        }
        if (p.getUrObraz() != null) {
            dto.setUroven(p.getUrObraz().getName());
        }
        return dto;
    }

    // Эндпоинт: получить информацию о поступлении для профиля
    @GetMapping("/profil/{id}/post_info")
    public List<PostInfoDto> getPostInfo(@PathVariable Integer id) {
        return postInfoRepository.findByProfileId(id).stream()
                .map(this::toPostInfoDto)
                .toList();
    }

    private PostInfoDto toPostInfoDto(PostInfo pi) {
        PostInfoDto dto = new PostInfoDto();
        dto.setId(pi.getId());
        dto.setKolMest(pi.getKolMest());
        dto.setStoimost(pi.getStoimost());
        dto.setProhodnoi(pi.getProhodnoi());
        dto.setGod(pi.getGod());
        if (pi.getOsnovPriema() != null) {
            dto.setOsnovanie(pi.getOsnovPriema().getName());
        }
        return dto;
    }

    // Эндпоинт: получить предметы для конкретного Post_info
    @GetMapping("/post_info/{id}/exams")
    public List<TrebExamDto> getExamsForPostInfo(@PathVariable Integer id) {
        List<Ispitania> ispitaniaList = ispitaniaRepository.findByPostInfoId(id);

        return ispitaniaList.stream()
                .flatMap(isp -> trebExamRepository.findByIspitaniaId(isp.getId()).stream())
                .filter(te -> te.getFormaSdachi() != null && te.getFormaSdachi().contains("ЕГЭ"))
                .map(this::toTrebExamDto)
                .toList();
    }

    @GetMapping("/exams/ege")
    public List<String> getUniqueEgeExams() {
        return trebExamRepository.findAll().stream()
                .filter(te -> te.getFormaSdachi() != null && te.getFormaSdachi().contains("ЕГЭ"))
                .map(te -> te.getExam().getName())
                .distinct()
                .toList();
    }

    private TrebExamDto toTrebExamDto(TrebExam te) {
        TrebExamDto dto = new TrebExamDto();
        dto.setMinBall(te.getMinBall());
        dto.setForma(te.getFormaSdachi());
        if (te.getExam() != null) {
            dto.setExamName(te.getExam().getName());
        }
        return dto;
    }

    @GetMapping("/napravleniya")
    public List<String> getAllNapravleniya() {
        return napravlenieRepository.findAll().stream()
                .map(Napravlenie::getName)
                .distinct()
                .toList();
    }
}