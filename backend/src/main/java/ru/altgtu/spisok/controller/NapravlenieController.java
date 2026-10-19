package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.dto.NapravlenieDto;
import ru.altgtu.spisok.dto.PostInfoDto;
import ru.altgtu.spisok.dto.ProfileDto;
import ru.altgtu.spisok.dto.TrebExamDto;
import ru.altgtu.spisok.entity.*;
import ru.altgtu.spisok.repository.*;
import ru.altgtu.spisok.repository.NapravlenieRepository;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class NapravlenieController {

    private final NapravlenieRepository napravlenieRepository;
    private final ProfileRepository profileRepository;

    private final IspitaniaRepository ispitaniaRepository;
    private final TrebExamRepository trebExamRepository;


    // 1. Получить все направления для конкретного вуза
    @GetMapping("/vuz/{vuzId}/napravleniya")
    public List<NapravlenieDto> getNapravleniyaByVuz(@PathVariable Integer vuzId) {
        return napravlenieRepository.findByVuzId(vuzId).stream()
                .map(this::toNapravlenieDto)
                .toList();
    }

    // 2. Получить все профили для конкретного направления
    @GetMapping("/napravlenie/{id}/profili")
    public List<ProfileDto> getProfiliByNapravlenie(@PathVariable Integer id) {
        return profileRepository.findByNapravlenieId(id).stream()
                .map(this::toProfileDto)
                .toList();
    }

    // --- Преобразования Entity -> DTO ---

    private NapravlenieDto toNapravlenieDto(Napravlenie n) {
        NapravlenieDto dto = new NapravlenieDto();
        dto.setId(n.getId());
        dto.setKod(n.getKod());
        dto.setName(n.getName());
        if (n.getFakultet() != null) {
            dto.setFakultet(n.getFakultet().getName());
        }
        return dto;
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

    private final PostInfoRepository postInfoRepository;

    // Эндпоинт: получить информацию о поступлении для профиля
    @GetMapping("/profil/{id}/post_info")
    public List<PostInfoDto> getPostInfo(@PathVariable Integer id) {
        return postInfoRepository.findByProfileId(id).stream()
                .map(this::toPostInfoDto)
                .toList();
    }

    // Преобразование
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

    // Эндпоинт: получить предметы для конкретного Post_info (без СЭ-предметов)
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
        // Достаем все требования из базы
        return trebExamRepository.findAll().stream()
                // Оставляем только ЕГЭшные
                .filter(te -> te.getFormaSdachi() != null && te.getFormaSdachi().contains("ЕГЭ"))
                // Берем только название предмета
                .map(te -> te.getExam().getName())
                // Убираем дубликаты (Русский язык может быть 100 раз)
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
                .distinct() // Убираем дубли, если одно название есть на бакалавриате и магистратуре
                .toList();
    }
}