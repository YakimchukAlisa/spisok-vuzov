package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Profile_file")
@Data
public class ProfileFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_File")
    private Integer id;

    @Column(name = "ID_Profile")
    private Integer profileId;

    @Column(name = "Name")
    private String name;

    @Column(name = "File_Url")
    private String fileUrl;
}