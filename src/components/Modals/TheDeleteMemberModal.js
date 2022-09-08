import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";
import styles from "./TheDeleteMemberModal.module.css";

const TheDeleteMemberModal = (props) => {
  const axios = require("axios").default;

  const showDeleteUser = useSelector((state) => state.showDeleteUser);

  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);

  const [usersNames, setUsersNames] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const dispatch = useDispatch();
  const closeDeleteUserModalHandler = () => {
    dispatch(storeActions.closeDeleteUserModal());
  };
  //dispatch(storeActions.closeMemberInfoModal());

  async function getNameUser(currentUsername) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}`;
    try {
      const response = await axios.get(APIRequestURL);
      //users = response.data.Items;
      // setUsers(
      //   response.data.Items.map((item) => ({
      //     userId: item.MemberId.N,
      //     animalPhoto: item.AnimalPhoto.S,
      //     name: item.Name.S,
      //     personalityType: item.PersonalityType.S,
      //     personalityGroup: analystsGroup.includes(item.PersonalityType.S)
      //       ? "Analysts"
      //       : diplomatsGroup.includes(item.PersonalityType.S)
      //       ? "Diplomats"
      //       : sentinelsGroup.includes(item.PersonalityType.S)
      //       ? "Sentinels"
      //       : explorersGroup.includes(item.PersonalityType.S)
      //       ? "Explorers"
      //       : "None",
      //   }))
      // );
      const usersDataResponse = response.data.Items;
      const usersNamesResponse = usersDataResponse.map((item) => item.Name.S);
      console.log(usersNamesResponse);
      setUsersNames(usersNamesResponse);
      setSelectedUserId(usersNames[0]);
      //console.log(users[0].Name.S);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (nameOfUserLoggedIn != "") {
      getNameUser(nameOfUserLoggedIn.toLowerCase());
    }
  }, [showDeleteUser, nameOfUserLoggedIn]);
  async function deleteUser(currentUsername, userId) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/member/${userId}`;
    try {
      const response = await axios.delete(APIRequestURL);
      //users = response.data.Items;
      // setUsers(
      //   response.data.Items.map((item) => ({
      //     userId: item.MemberId.N,
      //     animalPhoto: item.AnimalPhoto.S,
      //     name: item.Name.S,
      //     personalityType: item.PersonalityType.S,
      //     personalityGroup: analystsGroup.includes(item.PersonalityType.S)
      //       ? "Analysts"
      //       : diplomatsGroup.includes(item.PersonalityType.S)
      //       ? "Diplomats"
      //       : sentinelsGroup.includes(item.PersonalityType.S)
      //       ? "Sentinels"
      //       : explorersGroup.includes(item.PersonalityType.S)
      //       ? "Explorers"
      //       : "None",
      //   }))
      // );

      console.log(response);

      dispatch(storeActions.setDeletedUserStatus());
      //console.log(users[0].Name.S);
      closeDeleteUserModalHandler();
      getNameUser();
    } catch (error) {
      console.error(error);
    }
  }
  const setSelectedUserIdHandler = (e) => {
    setSelectedUserId(e.target.value);
  };
  const formSubmissionHandler = (event) => {
    event.preventDefault();
    deleteUser(nameOfUserLoggedIn.toLowerCase(), selectedUserId);
  };
  return (
    <>
      {showDeleteUser && (
        <>
          <div
            onClick={closeDeleteUserModalHandler}
            className={styles.overlay}
          ></div>
          <div className={styles.modal}>
            <form onSubmit={formSubmissionHandler}>
              <h3>Delete user</h3>
              <label for="userId">Username:</label>
              <select
                name="userId"
                value={selectedUserId}
                onChange={setSelectedUserIdHandler}
              >
                {usersNames.map((item) => (
                  <option value={item.toLowerCase()}>{item}</option>
                ))}
              </select>
              <button className={styles.form__button}>Delete</button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default TheDeleteMemberModal;
