import { Link } from "react-scroll";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./TheHeader.module.css";
import logo from "../../assets/behaviour.png";
import TheSignInModal from "../Modals/TheSignInModal";
import { storeActions } from "../Store/index.js";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useEffect } from "react";
import TheMemberEditModal from "../Modals/TheMemberEditModal";
import TheAddMemberModal from "../Modals/TheAddMemberModal";

const TheHeader = (props) => {
  const axios = require("axios").default;

  const [showUserMenu, setShowUserMenu] = useState(false);

  const signInActive = useSelector((state) => state.signInActive);
  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);
  const animalPhotoOfUserLoggedIn = useSelector(
    (state) => state.animalPhotoOfUserLoggedIn
  );
  const typeOfUserLoggedIn = useSelector((state) => state.typeOfUserLoggedIn);

  const dispatch = useDispatch();

  const showSignInModalHandler = () => {
    dispatch(storeActions.showSignInModal());
  };

  const POOL_DATA = {
    UserPoolId: "eu-central-1_TxFHYBwqN",
    ClientId: "3622gnqsgtrf9d4v3u2olfnnkf",
  };
  const userPool = new CognitoUserPool(POOL_DATA);
  const currentUser = userPool.getCurrentUser();

  const logOutUser = () => {
    currentUser.signOut();
    dispatch(storeActions.logOutUser());
  };
  const users = useSelector((state) => state.users);
  console.log(nameOfUserLoggedIn);
  const userLoggedIn = users.find(
    (item) => item.userId === nameOfUserLoggedIn.toLowerCase()
  );

  async function getInfoFromLoggedUser(username) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URL}/current-username/${username}/member/${username}`
      );
      const user = response.data.Items[0];
      //console.log(response);

      dispatch(storeActions.setAnimalPhotoOfUserLoggedIn(user.AnimalPhoto.S));
      dispatch(storeActions.setTypeOfUserLoggedIn(user.PersonalityType.S));

      console.log(response.data.Item);
    } catch (error) {
      console.error(error);
    }
  }

  const changeShowUserMenuValue = () => {
    setShowUserMenu(!showUserMenu);
  };

  const showEditUserModalHandler = () => {
    dispatch(storeActions.showEditUserModal());
  };

  useEffect(() => {
    console.log(animalPhotoOfUserLoggedIn);
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
