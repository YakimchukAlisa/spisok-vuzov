package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class ProfessionDto {
    private Integer id;
    private String name;
    private String description;
    private Long specialtyCount;
}