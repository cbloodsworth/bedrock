import { useState } from "react";
import Navbar from "../components/Navbar";
import { Grid, Box, Card, CardHeader, TextInput, Button } from "grommet";
import { Hide, View, Google, Linkedin } from "grommet-icons";
import loginImage from "../../src/assets/login.jpg";
import "../styles/Login.css";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // State to track the mode (login or sign up)
  
  const toggleMode = (toLoginMode : boolean) => {
    setIsLoginMode(toLoginMode); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/loginGoogle";
  };

  const handleLinkedinLogin = () => {
    //todo
  };

  return (
    <>
      <Navbar />
      <div className="loginPageContainer" id="loginPageContainer">
        <Grid
          columns={["40%", "60%"]}
          gap="none"
          alignContent="center"
          style={{ height: "100%" }}
        >
          <Box className="containerBoxResume">
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
                  width: "100%",
                }}
              >
                <div className="toggleButtonWrapper">
                  <Grid
                    columns={["50%", "50%"]}
                    gap="none"
                    alignContent="center"
                    style={{ height: "100%" }}
                  >
                    <button onClick={() => toggleMode(true)} className="toggleButton">
                      <span
                        className="toggleButtonText"
                        id={isLoginMode ? "active" : ""}
                      >
                        Login
                      </span>
                    </button>
                    <button onClick={() => toggleMode(false)} className="toggleButton">
                      <span
                        className="toggleButtonText"
                        id={!isLoginMode ? "active" : ""}
                      >
                        Sign Up
                      </span>
                    </button>
                  </Grid>
                </div>
              </CardHeader>
              <div className="signInWrapper">
                <p>Username or Email</p>
                <TextInput
                  className="signInArea"
                  placeholder="Email or Username"
                  id="usernameLogin"
                />
              </div>
              <div className="signInWrapper">
                <p>Password</p>
                <Box
                  direction="row"
                  align="center"
                  gap="none"
                  id="passwordArea"
                  style={{ position: "relative" }}
                >
                  <TextInput
                    className="signInArea"
                    id="passwordLogin"
                    placeholder="Enter password here"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    className="viewPasswordButton"
                    plain
                    icon={showPassword ? <Hide /> : <View />}
                    onClick={togglePasswordVisibility}
                  />
                </Box>

                {!isLoginMode && (
                  <>
                    <p>Confirm your password</p>
                    <Box
                      direction="row"
                      align="center"
                      gap="none"
                      id="confirmPasswordArea"
                      style={{ position: "relative" }}
                    >
                      <TextInput
                        className="signInArea"
                        id="confirmPasswordLogin"
                        placeholder="Confirm password here"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                      <Button
                        className="viewPasswordButton"
                        plain
                        icon={showPassword ? <Hide /> : <View />}
                        onClick={togglePasswordVisibility}
                      />
                    </Box>
                  </>
                )}
              </div>
              <div className="signInWrapper">
                <button id="signinButton">
                  {isLoginMode ? "Sign in" : "Sign up"}
                </button>
              </div>
              <div className="signInWrapper">
                <p>{isLoginMode ? "Or sign up with" : "Or log in with"}</p>
                <div id="buttonWrapper">
                  <Button
                    id="googleButton"
                    icon={<Google color="plain" />}
                    label="Google"
                    className="externalOauthButton"
                    onClick={handleGoogleLogin}
                  />
                  <Button
                    icon={<Linkedin color="plain" />}
                    label="LinkedIn"
                    className="externalOauthButton"
                    onClick={handleLinkedinLogin}
                  />
                </div>
              </div>
              <div className="signInWrapper">
                <a>
                  {isLoginMode
                    ? "Forgot Your Password?"
                    : "Already have an account? Log in"}
                </a>
              </div>
            </Card>
          </Box>
          <Box className="containerBoxResume">
            <img id="loginImage" src={loginImage} alt="login page" />
          </Box>
        </Grid>
      </div>
    </>
  );
};

export default Login;
