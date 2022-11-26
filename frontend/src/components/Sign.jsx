import React, { useState, useEffect, useRef } from "react";
import validator from 'validator';
import { useHistory } from 'react-router-dom';
import axios from '../config/axios';
import { SIGNUP_URL } from "../config/urls";
import { SIGNIN_URL } from "../config/urls";
import './stylesComponents/sign.css'
import { Loader } from "./MinorComponents";
import { Validate } from "./MinorComponents";

export default function Sign() {

    const history = useHistory();
    const redirect = () => {
      history.push('/');
    }
      if (localStorage.getItem('accessToken')) {
          redirect();
          window.location.reload();
      }
   

    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({
        signUp:'',
        signIn:''
    });
    const [signUpAlert, setSignUpAlert] = useState({
        name: {
            isError: false,
            text: ''
        },
        email: {
            isError: false,
            text: ''
        },
        password: {
            isError: false,
            text: ''
        },
    });
    const [signInAlert, setSignInAlert] = useState({
        email: {
            isError: false,
            text: ''
        },
        password: {
            isError: false,
            text: ''
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setServerErrors({ signUp:'', signIn:'' });
        }, 2500);
    
        return () => clearTimeout(timer);
      }, [serverErrors]);
      

    const changeSignUpValue = (key, value) => {
        setSignUpData({ ...signUpData, [key]: value.target.value });
        setSignUpAlert({ ...signUpAlert, [key]: {isError: false} });
    };
    const changeSignInValue = (key, value) => {
        setSignInData({ ...signInData, [key]: value.target.value });
        setSignInAlert({ ...signInAlert, [key]: {isError: false} });
    };

    const signUpValidate = () => {
        let errors = signUpAlert
        let passed = true;

        if (!signUpData.name) {
            errors = { ...errors, name: { isError: true, text: 'Name field is required' } };
            passed = false;
        }
        if (signUpData.name && signUpData.name.length < 3) {
            errors = { ...errors, name: { isError: true, text: 'The name is short' } };
            passed = false;
        }
        if (!signUpData.email) {
            errors = { ...errors, email: { isError: true, text: 'Email field is required' } };
            passed = false;
        };
        if (signUpData.email && !validator.isEmail(signUpData.email)) {
            errors = { ...errors, email: { isError: true, text: 'Email is not correct' } };
            passed = false;
        };
        if (!signUpData.password) {
            errors = { ...errors, password: { isError: true, text: 'Password field is required' } };
            passed = false;
        };
        if (signUpData.password && signUpData.password.length < 8) {
            errors = { ...errors, password: { isError: true, text: 'Short password' } };
            passed = false;
        };
        if (signUpData.password.length >= 8 && !validator.isStrongPassword(signUpData.password,{
            minSymbols: 0
        })) {
            errors = { ...errors, password: { isError: true, text: 'Must include [a-z], [A-Z] & [0-9]' } };
            passed = false;
        };
         setSignUpAlert(errors);
         return passed;
    };
    const signInValidate = () => {
        let errors = signInAlert
        let passed = true;
    
        if (!signInData.email) {
          errors= {...errors, email:{ isError: true, text: 'Please enter your email' }};
          passed = false;
        }
    
        if (!signInData.password) {
            errors= {...errors, password:{ isError: true, text: 'Please enter your password' }};
          passed = false;
        }
        setSignInAlert(errors);
        return passed;
      };


    const _signUp = () => {
        (async () => {
          if (!signUpValidate()) return;
          setServerErrors({ signUp:''});
          setLoading(true);
          try {
            const response = await axios.post(SIGNUP_URL, signUpData);
            setSignUpData({
              name: '',
              email: '',
              password: ''
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            axios.defaults.headers.common = {'Authorization': response.data.token};
            setLoading(false);
          } catch (e) {
            setLoading(false);
            console.log(e);
            setServerErrors({...serverErrors, signUp:`Error: ${e.response.data.message}`});
          }
        })();
      };

    const _signIn = () => {
        (async () => {
          if (!signInValidate()) return;
          setServerErrors({ signIn:''});
          setLoading(true);
          try {
            const response = await axios.post(SIGNIN_URL, signInData);
            setSignInData({
              email: '',
              password: ''
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            axios.defaults.headers.common = {'Authorization': response.data.token};
            setLoading(false);
          } catch (e) {
            setLoading(false);
            console.log(e);
            setServerErrors({...serverErrors, signIn:`Error: ${e.response.data.message}`});
          }
        })();
      };
    
    
    //css Class Ref
    const signRef = useRef(null);

    const onAddClick = (e) => {
        signRef.current.classList.add("rightPanelActive");
        setSignUpAlert({name:{isError: false, text: ''}, email: { isError: false, text: '' }, password: { isError: false, text: '' }})
    };
    const onRemoveClick = (e) => {
        signRef.current.classList.remove("rightPanelActive");
        setSignInAlert({email: { isError: false, text: '' }, password: { isError: false, text: '' }})
    };


    return (
        <div className="signBody">
            <div className="signContainer" ref={signRef} >
                <div className="signFormContainer signSignupContainer">
                    <form >
                        <h1>Create Account</h1>
                        <br />
                        <input type="text" placeholder="Name" onChange={(text) => changeSignUpValue('name', text)} value={signUpData.name} />
                        <Validate error={signUpAlert.name.isError} text={signUpAlert.name.text} />
                        <input type="text" placeholder="Email" onChange={(text) => changeSignUpValue('email', text)} value={signUpData.email} />
                        <Validate error={signUpAlert.email.isError} text={signUpAlert.email.text} />
                        <input type="password" placeholder="Password" onChange={(text) => changeSignUpValue('password', text)} value={signUpData.password} />
                        <Validate error={signUpAlert.password.isError} text={signUpAlert.password.text} />
                        <br />
                        <button onClick={_signUp}>Sign Up</button>
                        <a onClick={onRemoveClick} className="smallScreenSignup">Log in</a>
                        <div className="signLoaderContainer">
                            <Loader loading={isLoading} />
                        </div>
                        <p className="signErrors">{serverErrors.signUp}</p>
                    </form>
                </div>
                <div className="signFormContainer signSigninContainer">
                    <form action="#">
                        <h1>Sign in</h1>
                        <br />
                        <input type="text" placeholder="Email" onChange={(text) => changeSignInValue('email', text)} value={signInData.email} />
                        <Validate error={signInAlert.email.isError} text={signInAlert.email.text} />
                        <input type="password" placeholder="Password" onChange={(text) => changeSignInValue('password', text)} value={signInData.password}/>
                        <Validate error={signInAlert.password.isError} text={signInAlert.password.text} />
                        <br/>
                        <button onClick={_signIn}>Sign In</button>
                        <a onClick={onAddClick} className="smallScreenSignup">Create your account</a>
                        <div className="signLoaderContainer">
                            <Loader loading={isLoading} />
                        </div>
                        <p className="signErrors">{serverErrors.signIn}</p>
                    </form>
                </div>
                <div className="signOverlayContainer">
                    <div className="signOverlay">
                        <div className="signOverlayPanel">
                        </div>
                        <div class="signOverlayPanel signOverlayLeft">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button onClick={onRemoveClick} class="signGhost" id="signIn">Sign In</button>
                        </div>
                        <div className="signOverlayPanel signOverlayRight">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button onClick={onAddClick} className="signGhost" id="signUp">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}