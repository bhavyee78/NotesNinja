package com.notesapp.controller;

import com.notesapp.entity.NoteEntity;
import com.notesapp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {
    @Autowired
    private NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteEntity> uploadNote(
            @RequestPart("note") NoteEntity note,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(noteService.uploadNote(note, file));
    }

    @GetMapping
    public ResponseEntity<List<NoteEntity>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    @GetMapping("/search")
    public ResponseEntity<List<NoteEntity>> searchNotes(@RequestParam String query) {
        return ResponseEntity.ok(noteService.searchNotes(query));
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<NoteEntity>> getNotesBySubject(@PathVariable String subject) {
        return ResponseEntity.ok(noteService.getNotesBySubject(subject));
    }
}