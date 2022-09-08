import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store/index.js";
import TheMemberInfoModal from "../Modals/TheMemberInfoModal.js";

import styles from "./TheFilters.module.css";
import { current } from "@reduxjs/toolkit";

const TheFilters = (props) => {
  const axios = require("axios").default;
  const users = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const setUsers = (value) => {
    dispatch(storeActions.setUsers(value));
  };
  const setUsersForSummary = (value) => {
    dispatch(storeActions.setUsersForSummary(value));
  };

  const showMemberInfo = useSelector((state) => state.showMemberInfo);

  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);

  const addedNewUserStatus = useSelector((state) => state.addedNewUserStatus);
  const deletedUserStatus = useSelector((state) => state.deletedUserStatus);
  const editUserStatus = useSelector((state) => state.editUserStatus);
  const animalPhotoOfUserLoggedIn = useSelector(
    (state) => state.animalPhotoOfUserLoggedIn
  );
  const typeOfUserLoggedIn = useSelector((state) => state.typeOfUserLoggedIn);

  const selectedTeamLeader = useSelector((state) => state.selectedTeamLeader);

  const showMemberInfoModalHandler = (data) => {
    dispatch(storeActions.setNameOfClickedMember(data[0]));
    dispatch(storeActions.setAnimalPhotoOfClickedMember(data[1]));
    dispatch(storeActions.setGroupOfClickedMember(data[2]));
    dispatch(storeActions.setTypeOfClickedMember(data[3]));
    dispatch(storeActions.setStrategyOfClickedMember(data[4]));
    dispatch(storeActions.showMemberInfoModal());
  };

  const [selectGroup, setSelectGroup] = useState("");
  const [selectType, setSelectType] = useState("");
  const changeSelectGroup = (e) => {
    setSelectGroup(e.target.value);
    setSelectType("");
  };
  const changeSelectType = (e) => {
    setSelectType(e.target.value);
  };

  async function getUsers(currentUsername, teamLeader, group, type) {
    let APIRequestURL = "";
    if (teamLeader == "" || teamLeader == "ypzzol") {
      if (type == "" && group == "") {
        APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}`;
      } else if (type == "") {
        APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/personality-group/${group}`;
      } else {
        APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/personality-type/${type}`;
      }
    } else {
      if (type == "" && group == "") {
        APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/team-leader/${teamLeader}`;
      } else if (type == "") {
        APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/team-leader/${teamLeader}/personality-group/${group}`;
      } else {
        APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/team-leader/${teamLeader}/personality-type/${type}`;
      }
    }

    try {
      const response = await axios.get(APIRequestURL);
      console.log(response);
      setUsers(
        response.data.Items.map((item) => ({
          anonymize: item.Anonymize.BOOL,
          userId: item.MemberId.S,
          animalPhoto: item.AnimalPhoto.S,
          name: item.Name.S,
          teamLeader: item.TeamLeader.S,
          strategy: item.Strategy.S,
          personalityType: item.PersonalityType.S,
          personalityGroup: item.Group.S,
          personalityComponents: {
            extraverted: item.Extraverted.N,
            introverted: item.Introverted.N,
            intuitive: item.Intuitive.N,
            observant: item.Observant.N,
            thinking: item.Thinking.N,
            feeling: item.Feeling.N,
            judging: item.Judging.N,
            prospecting: item.Prospecting.N,
            assertive: item.Assertive.N,
            turbulent: item.Turbulent.N,
          },
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (selectGroup == "" && selectType == "") {
      setUsersForSummary(users);
    }
  }, [users]);
  useEffect(() => {
    if (addedNewUserStatus) {
      dispatch(storeActions.setAddedNewUserStatus(false));
    }
    if (nameOfUserLoggedIn != "") {
      getUsers(
        nameOfUserLoggedIn.toLowerCase(),
        selectedTeamLeader,
        selectGroup,
        selectType
      );
    }

    dispatch(storeActions.setDeletedUserStatus(false));
    dispatch(storeActions.setEditUserStatus(false));
  }, [
    selectGroup,
    selectType,
    nameOfUserLoggedIn,
    animalPhotoOfUserLoggedIn,
    typeOfUserLoggedIn,
    addedNewUserStatus,
    editUserStatus,
    deletedUserStatus,
    selectedTeamLeader,
  ]);

  return (
    <>
      <TheMemberInfoModal active={showMemberInfo} />
      <div id="ourteam" className={styles.filters}>
        <div className={styles.filters__info}>
          <h1>Check out our team members personalities.</h1>
          <p>
            Here is a list of our members personalities. You can filter this
            list using settings down below.
          </p>
        </div>
        {nameOfUserLoggedIn === "" && <h2>You need to sign in to see this.</h2>}
        {nameOfUserLoggedIn !== "" && (
          <>
            <div className={styles.filters__settings}>
              <select
                name="personalityGroup"
                value={selectGroup}
                onChange={changeSelectGroup}
              >
                <option value="">All groups</option>
                <option value="Analysts">Analysts</option>
                <option value="Diplomats">Diplomats</option>
                <option value="Sentinels">Sentinels</option>
                <option value="Explorers">Explorers</option>
              </select>
              <select
                name="personalityType"
                value={selectType}
                onChange={changeSelectType}
              >
                <option value="">All personalities</option>
                {(selectGroup === "Analysts" || selectGroup === "") && (
                  <>
                    <option value="Architect">Architect</option>
                    <option value="Logician">Logician</option>
                    <option value="Commander">Commander</option>
                    <option value="Debater">Debater</option>
                  </>
                )}
                {(selectGroup === "Diplomats" || selectGroup === "") && (
                  <>
                    <option value="Advocate">Advocate</option>
                    <option value="Mediator">Mediator</option>
                    <option value="Protagonist">Protagonist</option>
                    <option value="Campaigner">Campaigner</option>
                  </>
                )}
                {(selectGroup === "Sentinels" || selectGroup === "") && (
                  <>
                    <option value="Logistician">Logistician</option>
                    <option value="Defender">Defender</option>
                    <option value="Executive">Executive</option>
                    <option value="Consul">Consul</option>
                  </>
                )}
                {(selectGroup === "Explorers" || selectGroup === "") && (
                  <>
                    <option value="Virtuoso">Virtuoso</option>
                    <option value="Adventurer">Adventurer</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Entertainer">Entertainer</option>
                  </>
                )}
              </select>
            </div>
            {users === undefined ? (
              "Content loading... Please wait :)"
            ) : (
              <div className={styles.filters__results}>
                {users.map((user) => (
                  <div
                    className={`${styles["results__item"]} ${
                      styles[user.personalityGroup.toLowerCase()]
                    }`}
                    onClick={showMemberInfoModalHandler.bind(this, [
                      user.name,
                      user.animalPhoto,
                      user.personalityGroup,
                      user.personalityType,
                      user.strategy,
                    ])}
                  >
                    <div className={styles.results__image}>
                      <img
                        src={`/images/${user.animalPhoto}.png`}
                        alt={user.animalPhoto}
                      />
                    </div>
                    <div className={styles.results__name}>{user.name}</div>
                    <div className={styles.results__group}>
                      Group: {user.personalityGroup}
                    </div>
                    <div className={styles.results__type}>
                      Type: {user.personalityType}
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p>No results of this personality type.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TheFilters;
