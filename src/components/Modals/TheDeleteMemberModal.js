import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";

import styles from "./TheDeleteMemberModal.module.css";
//the module contains a modal in which a user with administrator right can delete the selected user
const TheDeleteMemberModal = () => {
  const axios = require("axios").default;

  const showDeleteUser = useSelector((state) => state.showDeleteUser);

  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);

  const [usersNames, setUsersNames] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const dispatch = useDispatch();

  //close TheDeleteMemberModal modal
  const closeDeleteUserModalHandler = () => {
    dispatch(storeActions.closeDeleteUserModal());
  };
  //getting a list of team members from the database
  async function getNameUser(currentUsername) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}`;
    try {
      const response = await axios.get(APIRequestURL);
      const usersDataResponse = response.data.Items;
      const usersNamesResponse = usersDataResponse.map((item) => item.Name.S);
      setUsersNames(usersNamesResponse);
      setSelectedUserId(usersNames[0]);
    } catch (error) {
      console.error(error);
    }
  }
  //getting a list of team members from the database each time the logged in user changes or the showDeleteUser helper variable changes
  useEffect(() => {
    if (nameOfUserLoggedIn != "") {
      getNameUser(nameOfUserLoggedIn.toLowerCase());
    }
  }, [showDeleteUser, nameOfUserLoggedIn]);
  //deleting a selected team member from the database, closing the modal and getting a new list of team members
  async function deleteUser(currentUsername, userId) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/member/${userId}`;
    try {
      const response = await axios.delete(APIRequestURL);

      dispatch(storeActions.setDeletedUserStatus());
      closeDeleteUserModalHandler();
      getNameUser();
    } catch (error) {
      console.error(error);
    }
  }
  //setting "userId" of the selected team member from the list
  const setSelectedUserIdHandler = (e) => {
    setSelectedUserId(e.target.value);
  };
  //sending the form and removing the selected team member
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
