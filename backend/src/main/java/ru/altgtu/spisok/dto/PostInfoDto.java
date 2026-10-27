package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class PostInfoDto {
    private Integer id;
    private String osnovanie; // Бюджет / Платное
    private Integer kolMest;
    private Integer stoimost;
    private Integer prohodnoi;
    private Integer god;
}