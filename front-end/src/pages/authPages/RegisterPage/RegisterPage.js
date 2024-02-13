import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


import RegisterAuthBox from '../../../components/RegisterAuthBox';
import RegisterPageHeader from './RegisterPageHeader';
import RegisterInput from './RegisterPageInput';
import RegisterPageFooter from './RegisterPageFooter';
import { validatePasswordConfirm } from './../validator'
import { registerValidator } from './../validator'
import Navbar from './../../../components/Navbar'
import { registerAction } from './registerAction'
import { loginAction } from '../LoginPage/loginAction';
import * as setKakao from '../../../redux/store/kakaoRegisterSlice';


const RegisterPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    
    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [nickname, setNickname] = useState("")
    const [birth, setBirth] = useState('')
    const [gender, setGender] = useState("")
    const [isFormValid, setIsFormValid] = useState(false)
    const [isPasswordValid, setIsPasswordVaild] = useState(false)
    const [readonly, setReadonly] = useState(false);
    // const [profile, setProfile] = useState("")


    const kakaoEmail = useSelector((state) => state.kakao.email);
    const kakaoReadonly = useSelector((state) => state.kakao.kakao);
    
    console.log(kakaoReadonly);
    console.log("location.state: ", location.state);
    console.log("location.state.email: ", location.state.email);
    console.log("location.state.kakao: ", location.state.kakao);

    const handleRegister = async () => {
        const userDetails = {
            userEmail: mail,
            password: password,
            nickname: nickname,
            birth: birth,
            gender: gender,
            profile_image: null
        }
        const res = await registerAction(userDetails)
        if (res) {
            dispatch(setKakao.setEmail(""));
            dispatch(setKakao.setKakao(false));
            const loginData = {
                userEmail: mail,
                password: password,
            }
            loginAction(loginData, dispatch, navigate)
        }
    }

    useEffect(() => {
        setIsFormValid(registerValidator(mail, nickname, gender, birth, isPasswordValid))
    }, [mail, nickname, gender, birth, isPasswordValid, setIsFormValid])

    useEffect(() => {
        setIsPasswordVaild(validatePasswordConfirm(password, passwordConfirm))
    }, [password, passwordConfirm, setIsPasswordVaild, setPasswordConfirm])

    useEffect(() => {
        setReadonly(kakaoReadonly)
        if(readonly){
            setMail(kakaoEmail);
        }
    }, [readonly]);

    return (
        <>
            <Navbar />
            <RegisterAuthBox>
                <RegisterPageHeader />
                <RegisterInput
                    mail={mail}
                    setMail={setMail}
                    password={password}
                    setPassword={setPassword}
                    passwordConfirm={passwordConfirm}
                    setPasswordConfirm={setPasswordConfirm}
                    nickname={nickname}
                    setNickname={setNickname}
                    gender={gender}
                    setGender={setGender}
                    birth={birth}
                    setBirth={setBirth}
                    readonly={readonly}
                />
                <RegisterPageFooter
                    isFormValid={isFormValid}
                    handleRegister={handleRegister}
                />
            </RegisterAuthBox>
        </>
    );
};

export default RegisterPage;