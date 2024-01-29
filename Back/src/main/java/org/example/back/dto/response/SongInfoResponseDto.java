package org.example.back.dto.response;

import java.util.List;

import org.example.back.entity.SongEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SongInfoResponseDto {
	private int songIdx;
	private String title;
	private String singer;
	private String mrFile;
	private int startTiming;
	private int runningTime;
	private List<SongLineResponseDto> songLineResponseDtoList;

	@Builder
	public SongInfoResponseDto (SongEntity songEntity, List<SongLineResponseDto> songLineResponseDtoList){
		this.songIdx = songEntity.getSongIdx();
		this.title = songEntity.getTitle();
		this.singer = songEntity.getSinger();
		this.mrFile = songEntity.getMrFile();
		this.startTiming = songEntity.getStartTiming();
		this.runningTime = songEntity.getRunningTime();
		this.songLineResponseDtoList = songLineResponseDtoList;
	}
}
