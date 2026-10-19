package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class NapravlenieDto {
    private Integer id;
    private String kod;
    private String name;
    private String fakultet;
}