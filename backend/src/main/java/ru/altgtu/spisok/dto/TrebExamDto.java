package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class TrebExamDto {
    private String examName;
    private Integer minBall;
    private Boolean isObyaz;
    private String forma;
}