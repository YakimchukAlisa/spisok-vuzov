package ru.altgtu.spisok.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProfessionDto {
    private Integer id;
    private String name;
    private String description;
    private Long specialtyCount;
    private List<Integer> sphereIds;
    private List<String> sphereNames;
}