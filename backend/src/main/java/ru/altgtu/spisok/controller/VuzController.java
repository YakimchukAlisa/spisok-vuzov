package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.entity.Vuz;
import ru.altgtu.spisok.repository.VuzRepository;

import java.util.List;

@RestController
@RequestMapping("/api/vuz")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VuzController {

    private final VuzRepository vuzRepository;

    @GetMapping
    public List<Vuz> getAll() {
        return vuzRepository.findAllByOrderByNameAsc();
    }

    @GetMapping("/{id}")
    public Vuz getById(@PathVariable Integer id) {
        return vuzRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Вуз не найден: " + id));
    }
}