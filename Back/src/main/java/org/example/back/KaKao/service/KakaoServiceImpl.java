package org.example.back.KaKao.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;



/*
 * 참고)
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
 *
 *
https://velog.io/@akskflwn/Rest-API-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84ReactSpring-boot
 *
 */

@Service
public class KakaoServiceImpl implements KakaoService {
    private final String KAKAO_REST_API_KEY = "a1d71ef7ee8a62c397eea8c14103b31d";
    private final String REDIRECT_URI = "https://i10e205.p.ssafy.io/auth/kakao";
    @Override
    public String[] getKakaoAccessToken(String code) {
        String access_token = "";
        String refresh_token = "";
        String requestURL = "https://kauth.kakao.com/oauth/token";

        try{
            URL url = new URL(requestURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=authorization_code");
            sb.append("&client_id=" + KAKAO_REST_API_KEY);
            sb.append("&redirect_uri=" + REDIRECT_URI);
            sb.append("&code=" + code);
            bw.write(sb.toString());
            bw.flush();

            int responseCode = conn.getResponseCode();
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";

            while((line = br.readLine()) != null){

            }

        } catch(Exception e){
            e.printStackTrace();
        }
        return new String[0];
    }
}
