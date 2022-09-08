import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { storeActions } from "../Store/index.js";
import styles from "./TheSignInModal.module.css";

const TheSignInModal = (props) => {
  const signInActive = useSelector((state) => state.signInActive);
  const dispatch = useDispatch();
  console.log(signInActive);
  const closeSignInModalHandler = () => {
    dispatch(storeActions.closeSignInModal());
    setInputsAreTouched(false);
  };

  const POOL_DATA = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(POOL_DATA);
  const signUp = (username, password) => {
    const user = {
      username: username,
      password: password,
    };
    const nicknameAttribute = {
      Name: "nickname",
      Value: username,
    };
    const attrList = [];
    attrList.push(new CognitoUserAttribute(nicknameAttribute));
    userPool.signUp(
      user.username,
      user.password,
      attrList,
      null,
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);
      }
    );
  };

  const signIn = (username, password) => {
    setErrorMessageLogin("");
    const authData = {
      Username: username,
      Password: password,
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.authenticateUser(authDetails, {
      onSuccess(result) {
        console.log(result);
        console.log(userPool.getCurrentUser());
        const user = userPool.getCurrentUser();
        user.getSession((err, session) => {
          if (err) {
            console.log("no session: " + err);
          } else {
            if (session.isValid()) {
              console.log(session);
              console.log("session cognito nameuser: " + session.CognitoUser);
              console.log(user);
              console.log(user.username);
              dispatch(
                storeActions.setNameOfUserLoggedIn(
                  session.accessToken.payload.username
                )
              );
            } else {
              console.log("session invalid: " + session);
            }
            closeSignInModalHandler();
          }
        });
      },
      onFailure(err) {
        setErrorMessageLogin("User or password invalid.");
      },
      newPasswordRequired() {
        setErrorMessageLogin(
          "You need to change your password! Contact page admin."
        );
      },
    });
  };
  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);
  console.log("namae: " + nameOfUserLoggedIn);

  const nameInputRef = useRef();
  const passwordInputRef = useRef();
  const [nameInputIsValid, setNameInputIsValid] = useState(false);
  const [passwordInputIsValid, setPasswordInputIsValid] = useState(false);
  const [inputsAreTouched, setInputsAreTouched] = useState(false);

  const [errorMessageLogin, setErrorMessageLogin] = useState("");
  //const [nameInput, setNameInput] = useState();
  //const [passwordInput, setPasswordInput] = useState();

  // const nameInputChangeHandler = (event) => {
  //   setNameInput(event.target.value);
  // };
  // const passwordInputChangeHandler = (event) => {
  //   setPasswordInput(event.target.value);
  // };

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    setInputsAreTouched(true);
    const nameInputValue = nameInputRef.current.value;
    const passwordInputValue = passwordInputRef.current.value;

    if (nameInputValue.trim() === "") {
      setNameInputIsValid(false);
      console.log("pusty name");
    } else {
      setNameInputIsValid(true);
    }
    if (passwordInputValue.trim() === "") {
      setPasswordInputIsValid(false);
      console.log("pusty password");
    } else {
      setPasswordInputIsValid(true);
    }
    if (nameInputIsValid && passwordInputIsValid) {
      console.log(nameInputValue + " " + passwordInputValue);
      //signUp(nameInputValue, passwordInputValue);
      signIn(nameInputValue, passwordInputValue);
    }
  };

  const nameInputInvalidResult = !nameInputIsValid && inputsAreTouched;
  const passwordInputInvalidResult = !passwordInputIsValid && inputsAreTouched;

  return (
    <>
      {signInActive && (
        <>
          <div
            onClick={closeSignInModalHandler}
            className={styles.overlay}
          ></div>
          <div className={styles.modal}>
            <form onSubmit={formSubmissionHandler}>
              <label className={styles.form__label} htmlFor="name">
                Name
              </label>
              <input
                name="name"
                className={
                  nameInputInvalidResult
                    ? `${styles["form__input--error"]} ${styles["form__input"]}`
                    : `${styles["form__input"]}`
                }
                type="text"
                ref={nameInputRef}
              />
              {nameInputInvalidResult && (
                <p className={styles.form__error_info}>
                  Name must not be empty.
                </p>
              )}
              <label className={styles.form__label} htmlFor="password">
                Password
              </label>
              <input
                name="password"
                className={
                  passwordInputInvalidResult
                    ? `${styles["form__input--error"]} ${styles["form__input"]}`
                    : `${styles["form__input"]}`
                }
                type="password"
                ref={passwordInputRef}
              />
              {passwordInputInvalidResult && (
                <p className={styles.form__error_info}>
                  Password must not be empty.
                </p>
              )}
              <button className={styles.form__button}>Login</button>
              {inputsAreTouched &&
                (!passwordInputInvalidResult || !nameInputInvalidResult) && (
                  <p className={styles.form__error_info}>{errorMessageLogin}</p>
                )}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default TheSignInModal;
