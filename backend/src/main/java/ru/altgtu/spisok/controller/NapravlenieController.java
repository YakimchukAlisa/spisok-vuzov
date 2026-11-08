package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.dto.*;
import ru.altgtu.spisok.entity.*;
import ru.altgtu.spisok.repository.*;
import ru.altgtu.spisok.dto.AbstractNapravlenieDto;
import ru.altgtu.spisok.repository.NapravlenieRepository.AbstractNapravlenieProjection;

import java.util.*;
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
    private final ProfessionRepository professionRepository;
    private final VuzRepository vuzRepository;

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

        Map<Integer, List<Integer>> spheresByNapravlenie =
                napravlenieRepository.findSpheresByVuzId(vuzId).stream()
                        .collect(Collectors.groupingBy(
                                NapravlenieRepository.NapravlenieSphereProjection::getNapravlenieId,
                                Collectors.mapping(NapravlenieRepository.NapravlenieSphereProjection::getSphereId, Collectors.toList())
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
                    dto.setExams(examsByNapravlenie.getOrDefault(p.getId(), List.of()));
                    dto.setProfiles(profilesByNapravlenie.getOrDefault(p.getId(), List.of()));
                    dto.setSphereIds(spheresByNapravlenie.getOrDefault(p.getId(), List.of()));
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
        ps.setUroven(proj.getUroven());
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

    @GetMapping("/napravleniya/by-sphere/{sphereId}")
    public List<AbstractNapravlenieDto> getNapravleniyaBySphere(@PathVariable Integer sphereId) {
        return napravlenieRepository.findAbstractBySphereId(sphereId).stream()
                .map(p -> {
                    AbstractNapravlenieDto dto = new AbstractNapravlenieDto();
                    dto.setId(p.getId());
                    dto.setKod(p.getKod());
                    dto.setName(p.getName());
                    dto.setOpisanie(p.getOpisanie());
                    dto.setVuzCount(p.getVuzCount() != null ? p.getVuzCount() : 0L);
                    dto.setUroven(p.getUroven());
                    dto.setProfessionCount(
                            professionRepository.countProfessionsBySphereAndKod(p.getKod())
                    );
                    return dto;
                })
                .toList();
    }

    private NapravlenieDto toNapravlenieDto(Napravlenie n) {
        NapravlenieDto dto = new NapravlenieDto();
        dto.setId(n.getId());
        dto.setKod(n.getKod());
        dto.setName(n.getName());
        dto.setOpisanie(n.getOpisanie());
        if (n.getFakultet() != null) {
            dto.setFakultetId(n.getFakultet().getId());
            dto.setFakultet(n.getFakultet().getName());
        }
        dto.setSphereIds(n.getSpheres().stream().map(Sphere::getId).toList());
        dto.setExams(List.of());
        dto.setProfiles(List.of());
        return dto;
    }

    @GetMapping("/napravlenie/{kod}")
    public Map<String, Object> getSpecialtyByKod(@PathVariable String kod) {
        List<Napravlenie> napravleniya = napravlenieRepository.findByKod(kod);
        if (napravleniya.isEmpty()) throw new RuntimeException("Специальность не найдена");

        Napravlenie first = napravleniya.get(0);
        Map<Integer, Map<String, Object>> uniqueVuzes = new HashMap<>();

        for (Napravlenie n : napravleniya) {
            if (n.getFakultet() != null && n.getFakultet().getVuz() != null) {
                Vuz v = n.getFakultet().getVuz();

                // Если вуз еще не добавлен в список
                if (!uniqueVuzes.containsKey(v.getId())) {

                    // Вызываем существующий метод, который возвращает VuzDto
                    VuzDto vuzDetails = vuzRepository.findVuzDetailsById(v.getId());

                    Map<String, Object> vuzMap = new HashMap<>();

                    if (vuzDetails != null) {
                        vuzMap.put("id", vuzDetails.getId());
                        vuzMap.put("name", vuzDetails.getName());
                        vuzMap.put("abbreviatura", vuzDetails.getAbbreviatura());
                        vuzMap.put("logoUrl", vuzDetails.getLogoUrl());
                        vuzMap.put("imageUrl", vuzDetails.getImageUrl());

                        // 👇 Упаковываем плоские поля VuzDto в структуру, которую ждет VuzCard
                        vuzMap.put("budget", Map.of(
                                "places", vuzDetails.getBudgetPlaces() != null ? vuzDetails.getBudgetPlaces() : 0,
                                "minScore", vuzDetails.getBudgetMinScore() != null ? vuzDetails.getBudgetMinScore() : 0
                        ));

                        vuzMap.put("paid", Map.of(
                                "places", vuzDetails.getPaidPlaces() != null ? vuzDetails.getPaidPlaces() : 0,
                                "minScore", vuzDetails.getPaidMinScore() != null ? vuzDetails.getPaidMinScore() : 0,
                                "minPrice", vuzDetails.getPaidMinPrice() != null ? vuzDetails.getPaidMinPrice() : 0
                        ));
                    } else {
                        // Если по какой-то причине статистика не нашлась
                        vuzMap.put("id", v.getId());
                        vuzMap.put("name", v.getName());
                        vuzMap.put("budget", Map.of("places", 0, "minScore", 0));
                        vuzMap.put("paid", Map.of("places", 0, "minScore", 0, "minPrice", 0));
                    }

                    uniqueVuzes.put(v.getId(), vuzMap);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("kod", first.getKod());
        response.put("name", first.getName());
        response.put("opisanie", first.getOpisanie());
        response.put("vuzes", uniqueVuzes.values());

        return response;
    }

    @GetMapping("/napravlenie/{kod}/similar")
    public List<AbstractNapravlenieDto> getSimilarSpecialties(@PathVariable String kod) {
        List<Napravlenie> currentList = napravlenieRepository.findByKod(kod);
        if (currentList.isEmpty()) return List.of();

        Napravlenie current = currentList.get(0);

        List<Integer> currentProfIds = current.getProfessions() != null
                ? current.getProfessions().stream().map(Profession::getId).toList()
                : List.of();

        List<Napravlenie> linkedByProfessions = currentProfIds.isEmpty()
                ? List.of()
                : napravlenieRepository.findByProfessionIds(currentProfIds);

        Integer sphereId = current.getSpheres() != null && !current.getSpheres().isEmpty()
                ? current.getSpheres().iterator().next().getId()
                : null;

        List<Napravlenie> sameSphere = sphereId != null
                ? napravlenieRepository.findBySphereId(sphereId)
                : List.of();

        Map<String, Napravlenie> uniqueMap = new LinkedHashMap<>();

        for (Napravlenie n : linkedByProfessions) {
            if (!n.getName().equals(current.getName())) {
                uniqueMap.putIfAbsent(n.getName(), n);
            }
        }

        for (Napravlenie n : sameSphere) {
            if (!n.getName().equals(current.getName())) {
                uniqueMap.putIfAbsent(n.getName(), n);
            }
        }

        return uniqueMap.values().stream()
                .limit(4)
                .map(n -> {
                    AbstractNapravlenieDto dto = new AbstractNapravlenieDto();
                    dto.setId(n.getId());
                    dto.setKod(n.getKod());
                    dto.setName(n.getName());
                    dto.setOpisanie(n.getOpisanie());
                    dto.setVuzCount(1L);
                    dto.setProfessionCount(professionRepository.countProfessionsBySphereAndKod(n.getKod()));

                    // СОБИРАЕМ ВСЕ СФЕРЫ
                    if (n.getSpheres() != null) {
                        dto.setSphereIds(n.getSpheres().stream().map(Sphere::getId).toList());
                        dto.setSphereNames(n.getSpheres().stream().map(Sphere::getName).toList());
                    }

                    return dto;
                })
                .toList();
    }

    @GetMapping("/napravlenie/{kod}/professions")
    public List<ProfessionDto> getProfessionsBySpecialty(@PathVariable String kod) {
        List<Napravlenie> napravleniya = napravlenieRepository.findByKod(kod);
        if (napravleniya.isEmpty()) return List.of();

        Napravlenie firstNapravlenie = napravleniya.get(0);

        return professionRepository.findProfessionsByNapravlenieKod(kod).stream()
                .map(p -> {
                    ProfessionDto dto = new ProfessionDto();
                    dto.setId(p.getId());
                    dto.setName(p.getName());
                    dto.setDescription(p.getDescription());
                    dto.setSpecialtyCount(napravlenieRepository.countSpecialtiesByProfessionId(p.getId()));

                    // 👇 СОБИРАЕМ ВСЕ СФЕРЫ У НАПРАВЛЕНИЯ
                    if (firstNapravlenie.getSpheres() != null) {
                        dto.setSphereIds(firstNapravlenie.getSpheres().stream().map(Sphere::getId).toList());
                        dto.setSphereNames(firstNapravlenie.getSpheres().stream().map(Sphere::getName).toList());
                    }
                    return dto;
                })
                .toList();
    }
}