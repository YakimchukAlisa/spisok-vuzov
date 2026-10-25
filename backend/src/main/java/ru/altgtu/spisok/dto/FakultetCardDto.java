package ru.altgtu.spisok.dto;

import lombok.Data;

@Data // Используем Lombok для геттеров/сеттеров
public class FakultetCardDto {
    private Integer id;
    private String shortName;
    private String fullName;
    private String description;
    private String imageUrl;

    // Вложенные объекты для бакалавриата и магистратуры
    private Stats bachelor;
    private Stats master;

    @Data
    public static class Stats {
        private Integer directions = 0;
        private Integer budgetPlaces = 0;
        private Integer paidPlaces = 0;
        private Integer minPrice = 0;
    }

}