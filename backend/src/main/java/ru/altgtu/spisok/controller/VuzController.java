package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.dto.VuzDto;
import ru.altgtu.spisok.entity.Gorod;
import ru.altgtu.spisok.entity.Vuz;
import ru.altgtu.spisok.repository.GorodRepository;
import ru.altgtu.spisok.repository.VuzRepository;
import ru.altgtu.spisok.repository.VuzVozmRepository;
import ru.altgtu.spisok.dto.VuzCardDto;
import java.util.List;

@RestController
@RequestMapping("/api/vuz")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VuzController {

    private final VuzRepository vuzRepository;
    private final VuzVozmRepository vuzVozmRepository;
    
    @GetMapping
    public List<VuzDto> getAll() {
        return vuzRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public VuzDto getById(@PathVariable Integer id) {
        // Используем новый запрос
        VuzDto vuz = vuzRepository.findVuzDetailsById(id);
        if (vuz == null) {
            throw new RuntimeException("Вуз не найден: " + id);
        }
        return vuz;
    }

    private VuzDto toDto(Vuz vuz) {
        VuzDto dto = new VuzDto();
        dto.setId(vuz.getId());
        dto.setName(vuz.getName());
        dto.setAbbreviatura(vuz.getAbbreviatura());
        dto.setOpisanie(vuz.getOpisanie());
        dto.setAdress(vuz.getAdress());
        dto.setSite(vuz.getSite());
        dto.setEmail(vuz.getEmail());
        dto.setPhone(vuz.getPhone());
        dto.setVkUrl(vuz.getVkUrl());
        dto.setTelegramUrl(vuz.getTelegramUrl());
        dto.setMaxUrl(vuz.getMaxUrl());
        dto.setImageUrl(vuz.getImageUrl());
        dto.setGorod(vuz.getGorod().getName());

        return dto;
    }

    // Эндпоинт: получить доп. возможности для вуза
    @GetMapping("/{id}/vozmozhnosti")
    public List<String> getVozmozhnosti(@PathVariable Integer id) {
        return vuzVozmRepository.findByVuzId(id).stream()
                .map(vv -> vv.getDopVozm().getName()) // Достаем просто название
                .toList();
    }

    private final GorodRepository gorodRepository;

    @GetMapping("/goroda")
    public List<String> getAllGoroda() {
        return gorodRepository.findAll().stream()
                .map(Gorod::getName)
                .toList();
    }

    // Эндпоинт для главной страницы (список карточек)
    @GetMapping("/cards")
    public List<VuzCardDto> getVuzCards() {
        List<VuzCardDto> cards = vuzRepository.findAllVuzCards();
        return cards;
    }
}