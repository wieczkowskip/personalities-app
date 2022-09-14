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
//modal displays the user's login panel
const TheSignInModal = () => {
  const signInActive = useSelector((state) => state.signInActive);
  const dispatch = useDispatch();

  //closing the modal
  const closeSignInModalHandler = () => {
    dispatch(storeActions.closeSignInModal());
    setInputsAreTouched(false);
  };

  const POOL_DATA = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(POOL_DATA);
  //new user account registration in Cognito
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
          console.error(err);
          return;
        }
      }
    );
  };
  //logging in to the user account in Cognito
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
    cognitoUser.authenticateUser(authDetails, {
      onSuccess(result) {
        const user = userPool.getCurrentUser();
        user.getSession((err, session) => {
          if (err) {
            console.error("no session: " + err);
          } else {
            if (session.isValid()) {
              dispatch(
                storeActions.setNameOfUserLoggedIn(
                  session.accessToken.payload.username
                )
              );
            } else {
              console.error("session invalid: " + session);
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

  const nameInputRef = useRef();
  const passwordInputRef = useRef();
  const [nameInputIsValid, setNameInputIsValid] = useState(false);
  const [passwordInputIsValid, setPasswordInputIsValid] = useState(false);
  const [inputsAreTouched, setInputsAreTouched] = useState(false);

  const [errorMessageLogin, setErrorMessageLogin] = useState("");
  //sending the form, checking the correctness of the inputs and making an attempt to log into the user's account with the given values in the inputs
  const formSubmissionHandler = (event) => {
    event.preventDefault();
    setInputsAreTouched(true);
    const nameInputValue = nameInputRef.current.value;
    const passwordInputValue = passwordInputRef.current.value;

    if (nameInputValue.trim() === "") {
      setNameInputIsValid(false);
    } else {
      setNameInputIsValid(true);
    }
    if (passwordInputValue.trim() === "") {
      setPasswordInputIsValid(false);
    } else {
      setPasswordInputIsValid(true);
    }
    if (nameInputIsValid && passwordInputIsValid) {
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
