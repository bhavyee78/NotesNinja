package com.notesapp.repository;

import com.notesapp.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
    List<NoteEntity> findBySubject(String subject);
    List<NoteEntity> findByTitleContainingIgnoreCase(String title);
}