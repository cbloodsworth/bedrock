import { useState } from "react";
import Navbar from "../components/Navbar"
import { Grid, Box, Card, CardHeader, TextInput, Button } from "grommet"
import { Hide, View, Google, Linkedin } from 'grommet-icons';
import loginImage from '../../src/assets/login.jpg'
import '../styles/Login.css'

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true); // State to track the mode (login or sign up)

    const toggleMode = (toLoginMode : boolean) => {
        setIsLoginMode(toLoginMode); // Toggle the mode between login and sign up
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleLogin = () => { 
        //todo
    };

    const handleLinkedinLogin = () => {
        //todo
    };

    const handleSubmit = async() => {
        //todo
        console.log(username, password, confirmPassword)
    }
    

    return (
        <>
            <Navbar/>
            <div className="loginPageContainer" id='loginPageContainer'>
                <Grid columns={["40%", "60%"]} gap="none"  alignContent="center" style={{ height: "100%" }}>
                    <Box className='containerBoxResume'>
                        <Card 
                        className="LoginContainer"
                        pad="small"
                        gap="small"
                        id="LoginContainer"
                        round={false} 
                        >
                        <CardHeader
                        style={{
                            fontSize: "25px",
                            fontWeight: "600",
                            width: "100%"
                            }}
                        >
                        <div className='toggleButtonWrapper'>
                        <Grid columns={["50%", "50%"]} gap="none"  alignContent="center" style={{ height: "100%" }}>
                            <button style={{border: "2px solid black" , borderRight:"0"}} onClick={() => toggleMode(true)} className="toggleButton">
                                <span className='toggleButtonText' id={isLoginMode ? 'active' : ''}>Login</span>
                            </button>
                            <button style={{border: "2px solid black" , borderLeft:"0"}} onClick={() => toggleMode(false)} className="toggleButton">
                                <span className='toggleButtonText' id={!isLoginMode ? 'active' : ''}>Sign Up</span>
                            </button>
                        </Grid>
                        </div>
                        </CardHeader>
                        <div className="signInWrapper" style={{marginBottom: "0"}}>
                            <h3>{isLoginMode ? "Log In To Your Account" : "Create An Account"}</h3>
                            {/* <p>{isLoginMode ? "Welcome back to DynaCV" : "Join us and get started today"}</p> */}
                        </div>
                        <div className='signInWrapper'>
                            <p>Username or Email</p>
                            <TextInput
                                className='signInArea'
                                id="usernameLogin"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />  
                        </div>
                        <div className='signInWrapper'>
                            <p>Password</p>
                            <Box direction="row" align="center" gap="none" id="passwordArea" style={{position:"relative"}}>
                                <TextInput
                                    className='signInArea'
                                    id='passwordLogin'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <Button
                                    className='viewPasswordButton'
                                    plain
                                    icon={showPassword ? <Hide /> : <View />}
                                    onClick={togglePasswordVisibility}
                                />
                            </Box>
                            </div>
                            {!isLoginMode && (
                                <div className='signInWrapper'>
                                <p>Confirm your password</p>
                                <Box direction="row" align="center" gap="none" id="confirmPasswordArea" style={{position:"relative"}}>
                                    <TextInput
                                        className='signInArea'
                                        id='confirmPasswordLogin'
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                    />
                                    <Button
                                        className='viewPasswordButton'
                                        plain
                                        icon={showPassword ? <Hide /> : <View />}
                                        onClick={togglePasswordVisibility}
                                    />
                                </Box>
                                </div>
                            )}

                        <div className='signInWrapper'>
                            <button onClick={handleSubmit} id='signinButton'>{isLoginMode ? "Sign in" : "Sign up"}</button>
                        </div>
                        <div className='signInWrapper'>
                            <p>{isLoginMode ? "Or Log In With" : "Or Sign Up With"}</p>
                            <div id='buttonWrapper'>
                                <Button
                                    id='googleButton'
                                    icon={<Google color="plain"/>}
                                    label="Google"
                                    className='externalOauthButton'
                                    onClick={handleGoogleLogin}
                                />
                                <Button
                                    icon={<Linkedin color="plain"/>}
                                    label="LinkedIn"
                                    className='externalOauthButton'
                                    onClick={handleLinkedinLogin}
                                />
                            </div>
                        </div>
                        <div className='signInWrapper'>
                            <a style={{cursor: "pointer"}}>{isLoginMode ? "Forgot Your Password?" : "Already have an account? Log in"}</a>
                        </div>
                        </Card>
                    </Box>
                    <Box className='containerBoxResume'>
                        <img id='loginImage' src={loginImage} alt="login page" />
                    </Box>
                </Grid>
            </div>
        </>
    )
}

export default Login;
