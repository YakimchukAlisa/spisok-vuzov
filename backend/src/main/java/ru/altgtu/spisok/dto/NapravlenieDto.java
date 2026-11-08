package ru.altgtu.spisok.dto;

import lombok.Data;
import java.util.List;

@Data
public class NapravlenieDto {
    private Integer id;
    private String kod;
    private String name;
    private String opisanie;
    private String fakultet;
    private Integer fakultetId;

    private List<Integer> sphereIds;

    // Экзамены (ЕГЭ) для направления
    private List<String> exams;

    // СПИСОК ПРОФИЛЕЙ ЭТОГО НАПРАВЛЕНИЯ
    private List<ProfileStats> profiles;

    @Data
    public static class ProfileStats {
        private Integer id;
        private String name;
        private String forma;
        private Integer srokObuchMes;
        private Integer budgetPlaces;
        private Integer budgetMinScore;
        private Integer paidPlaces;
        private Integer paidMinScore;
        private Integer paidMinPrice;
        private String uroven;
    }
}