import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-scroll";
import { CognitoUserPool } from "amazon-cognito-identity-js";

import logo from "../../assets/behaviour.png";

import { storeActions } from "../Store/index.js";

import TheSignInModal from "../Modals/TheSignInModal";
import TheMemberEditModal from "../Modals/TheMemberEditModal";
import TheAddMemberModal from "../Modals/TheAddMemberModal";

import styles from "./TheHeader.module.css";

//the module contains the entire "header" section
const TheHeader = () => {
  const axios = require("axios").default;

  const [showUserMenu, setShowUserMenu] = useState(false);

  const signInActive = useSelector((state) => state.signInActive);
  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);
  const animalPhotoOfUserLoggedIn = useSelector(
    (state) => state.animalPhotoOfUserLoggedIn
  );
  const typeOfUserLoggedIn = useSelector((state) => state.typeOfUserLoggedIn);

  const dispatch = useDispatch();

  //TheSignInModal display support
  const showSignInModalHandler = () => {
    dispatch(storeActions.showSignInModal());
  };

  const POOL_DATA = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(POOL_DATA);
  const currentUser = userPool.getCurrentUser();

  //logout of the currently logged in user
  const logOutUser = () => {
    currentUser.signOut();
    dispatch(storeActions.logOutUser());
  };

  const users = useSelector((state) => state.users);
  const userLoggedIn = users.find(
    (item) => item.userId === nameOfUserLoggedIn.toLowerCase()
  );

  //getting data from the server about the logged in user
  async function getInfoFromLoggedUser(username) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URL}/current-username/${username}/member/${username}`
      );
      const user = response.data.Items[0];

      dispatch(storeActions.setAnimalPhotoOfUserLoggedIn(user.AnimalPhoto.S));
      dispatch(storeActions.setTypeOfUserLoggedIn(user.PersonalityType.S));
    } catch (error) {
      console.error(error);
    }
  }

  //TheSignInModal display support
  const changeShowUserMenuValue = () => {
    setShowUserMenu(!showUserMenu);
  };
  //TheMemberEditModal display support
  const showEditUserModalHandler = () => {
    dispatch(storeActions.showEditUserModal());
  };
  //getting data about the currently logged in user after each login of a new user
  useEffect(() => {
    if (currentUser != null) {
      dispatch(storeActions.setNameOfUserLoggedIn(currentUser.username));
    }
    if (nameOfUserLoggedIn != "") {
      getInfoFromLoggedUser(nameOfUserLoggedIn.toLowerCase());
    }
  }, [nameOfUserLoggedIn, animalPhotoOfUserLoggedIn, typeOfUserLoggedIn]);

  return (
    <>
      <TheSignInModal active={signInActive} />
      <TheAddMemberModal />
      <TheMemberEditModal />
      <header className={styles.header}>
        <div className={styles.header__logo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.header__links}>
          <Link
            to="personalities"
            spy={true}
            smooth={true}
            offset={50}
            duration={500}
            className={styles.links__link}
          >
            Personalities
          </Link>
          <Link
            to="summary"
            spy={true}
            smooth={true}
            offset={50}
            duration={500}
            className={styles.links__link}
          >
            Summary
          </Link>
          <Link
            to="ourteam"
            spy={true}
            smooth={true}
            offset={50}
            duration={500}
            className={styles.links__link}
          >
            Our team
          </Link>
          {nameOfUserLoggedIn === "" && (
            <div
              onClick={showSignInModalHandler}
              className={`${styles["links__link"]} ${styles["links__signin"]}`}
            >
              Sign in
            </div>
          )}
          {nameOfUserLoggedIn !== "" && (
            <div className={styles.user__menu}>
              <div
                onClick={changeShowUserMenuValue}
                className={styles.menu__image}
              >
                <img
                  src={`/images/${animalPhotoOfUserLoggedIn}.png`}
                  alt={animalPhotoOfUserLoggedIn}
                />
              </div>
              {showUserMenu && (
                <div className={styles.menu__options}>
                  <div>{userLoggedIn.name}</div>
                  <div>Type: {typeOfUserLoggedIn}</div>
                  <div
                    onClick={showEditUserModalHandler}
                    className={`${styles["links__link"]} ${styles["links__signout"]}`}
                  >
                    Settings
                  </div>
                  <div
                    onClick={logOutUser}
                    className={`${styles["links__link"]} ${styles["links__signout"]}`}
                  >
                    Sign out
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default TheHeader;
