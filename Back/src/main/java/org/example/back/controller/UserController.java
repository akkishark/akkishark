package org.example.back.controller;


import lombok.RequiredArgsConstructor;
import org.example.back.dto.request.PatchUserRequestDto;
import org.example.back.dto.response.GetUserResponseDto;
import org.example.back.dto.response.PatchUserResponseDto;
import org.example.back.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal UserDetails userDetails){

        GetUserResponseDto result = userService.getUser(userDetails.getUsername());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PatchMapping("/patch")
    public ResponseEntity<?> patchUser(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody PatchUserRequestDto requestDto){

        PatchUserResponseDto result = userService.patchUser(userDetails.getUsername(), requestDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
