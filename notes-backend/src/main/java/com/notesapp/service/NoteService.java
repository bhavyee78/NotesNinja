package com.notesapp.service;

import com.notesapp.entity.NoteEntity;
import com.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

    public NoteEntity uploadNote(NoteEntity note, MultipartFile file) {
        // Implement file upload logic here
        return noteRepository.save(note);
    }

    public List<NoteEntity> getAllNotes() {
        return noteRepository.findAll();
    }

    public List<NoteEntity> searchNotes(String query) {
        return noteRepository.findByTitleContainingIgnoreCase(query);
    }

    public List<NoteEntity> getNotesBySubject(String subject) {
        return noteRepository.findBySubject(subject);
    }
}