package org.example.back.service;

import java.util.List;

import org.example.back.dto.response.SongResponseDto;

public interface SongService {
	List<SongResponseDto> findAllSong();
}
