import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";

import Slider from "@mui/material/Slider";

import styles from "./TheMemberEditModal.module.css";
//the module contains a modal that is used to change the account data of the currently logged in user
const TheMemberEditModal = () => {
  const axios = require("axios").default;

  const [anonymizeCheckbox, setAnonymizeCheckbox] = useState(false);

  const [extravertedEditValue, setExtravertedEditValue] = useState();
  const [intuitiveEditValue, setIntuitiveEditValue] = useState();
  const [thinkingEditValue, setThinkingEditValue] = useState();
  const [judgingEditValue, setJudgingEditValue] = useState();
  const [assertiveEditValue, setAssertiveEditValue] = useState();

  const [personalityTypeInput, setPersonalityTypeInput] = useState("");
  const [personalityGroupInput, setPersonalityGroupInput] = useState("");
  const [strategyNameInput, setStrategyNameInput] = useState("");

  const showEditUser = useSelector((state) => state.showEditUser);
  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);
  const animalPhotoOfUserLoggedIn = useSelector(
    (state) => state.animalPhotoOfUserLoggedIn
  );
  const [editAnimalPhotoValue, setEditAnimalPhotoValue] = useState("");

  //setting the initial avatar downloaded from the database for the currently logged in user
  useEffect(() => {
    setEditAnimalPhotoValue(animalPhotoOfUserLoggedIn);
  }, [animalPhotoOfUserLoggedIn]);

  const dispatch = useDispatch();

  //closing the modal and setting the values of individual personality components for the currently logged in user in accordance with the data from the database
  const closeEditUserModalHandler = () => {
    dispatch(storeActions.closeEditUserModal());
    if (userLoggedIn != undefined) {
      setAnonymizeCheckbox(userLoggedIn.anonymize);
      setExtravertedEditValue(userLoggedIn.personalityComponents.extraverted);
      setIntuitiveEditValue(userLoggedIn.personalityComponents.intuitive);
      setThinkingEditValue(userLoggedIn.personalityComponents.thinking);
      setJudgingEditValue(userLoggedIn.personalityComponents.judging);
      setAssertiveEditValue(userLoggedIn.personalityComponents.assertive);
    }
  };

  //calculation of the group and personality type and strategy based on the percentage data of individual personality components
  const calcGroupTypeAndStrategy = (data) => {
    const typeName = `${data.extraverted >= 50 ? "E" : "I"}${
      data.intuitive >= 50 ? "N" : "S"
    }${data.thinking >= 50 ? "T" : "F"}${data.judging >= 50 ? "J" : "P"}`;
    const personalityTypes = [
      { type: "INTJ", name: "Architect" },
      { type: "INTP", name: "Logician" },
      { type: "ENTJ", name: "Commander" },
      { type: "ENTP", name: "Debater" },
      { type: "INFJ", name: "Advocate" },
      { type: "INFP", name: "Mediator" },
      { type: "ENFJ", name: "Protagonist" },
      { type: "ENFP", name: "Campaigner" },
      { type: "ISTJ", name: "Logistician" },
      { type: "ISFJ", name: "Defender" },
      { type: "ESTJ", name: "Executive" },
      { type: "ESFJ", name: "Consul" },
      { type: "ISTP", name: "Virtuoso" },
      { type: "ISFP", name: "Adventurer" },
      { type: "ESTP", name: "Entrepreneur" },
      { type: "ESFP", name: "Entertainer" },
    ];
    const analystsRegex = /(I|E)NT(J|P)/;
    const diplomatsRegex = /(I|E)NF(J|P)/;
    const sentinelsRegex = /(I|E)S(T|F)J/;

    const personalityGroupName = analystsRegex.test(typeName)
      ? "Analysts"
      : diplomatsRegex.test(typeName)
      ? "Diplomats"
      : sentinelsRegex.test(typeName)
      ? "Sentinels"
      : "Explorers";

    const strategies = [
      { name: "Confident Individualism", type: "IA" },
      { name: "People Mastery", type: "EA" },
      { name: "Constant Improvement", type: "IT" },
      { name: "Social Engagement", type: "ET" },
    ];
    const strategyType = `${data.extraverted >= 50 ? "E" : "I"}${
      data.assertive >= 50 ? "A" : "T"
    }`;
    const stategyName = strategies.find(
      (item) => item.type === strategyType
    ).name;
    const personalityTypeName = personalityTypes.find(
      (item) => item.type === typeName
    ).name;
    setPersonalityTypeInput(personalityTypeName);
    setPersonalityGroupInput(personalityGroupName);
    setStrategyNameInput(stategyName);
  };
  //updating user data in the database
  async function updateUser(currentUsername, newUserData) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/member/${newUserData.id}`;
    try {
      const response = await axios.put(APIRequestURL, newUserData);

      dispatch(storeActions.setEditUserStatus(true));
    } catch (error) {
      console.error(error);
    }
  }
  //submitting the form, updating user data in the database and closing the modal
  const formSubmissionHandler = (event) => {
    event.preventDefault();
    const updatedUser = {
      anonymize: anonymizeCheckbox,
      id: nameOfUserLoggedIn.toLowerCase(),
      animalPhoto: editAnimalPhotoValue,
      personalityType: personalityTypeInput,
      personalityGroup: personalityGroupInput,
      strategy: strategyNameInput,
      extraverted: extravertedEditValue,
      intuitive: intuitiveEditValue,
      thinking: thinkingEditValue,
      judging: judgingEditValue,
      assertive: assertiveEditValue,
    };
    dispatch(
      storeActions.setAnimalPhotoOfUserLoggedIn(updatedUser.animalPhoto)
    );
    dispatch(storeActions.setTypeOfUserLoggedIn(updatedUser.personalityType));
    updateUser(nameOfUserLoggedIn.toLowerCase(), updatedUser);
    closeEditUserModalHandler();
  };
  //setting the currently selected user avatar
  const setEditAnimalPhotoHandler = (e) => {
    setEditAnimalPhotoValue(e.target.value);
  };

  const users = useSelector((state) => state.users);
  const userLoggedIn = users.find(
    (item) => item.userId === nameOfUserLoggedIn.toLowerCase()
  );

  const mark = [
    [
      {
        value: 0,
        label: `Extraverted ${extravertedEditValue}`,
      },
      {
        value: 100,
        label: `Introverted ${100 - extravertedEditValue}`,
      },
    ],
    [
      {
        value: 0,
        label: `Intuitive ${intuitiveEditValue}`,
      },
      {
        value: 100,
        label: `Observant ${100 - intuitiveEditValue}`,
      },
    ],
    [
      {
        value: 0,
        label: `Thinking ${thinkingEditValue}`,
      },
      {
        value: 100,
        label: `Feeling ${100 - thinkingEditValue}`,
      },
    ],
    [
      {
        value: 0,
        label: `Judging ${judgingEditValue}`,
      },
      {
        value: 100,
        label: `Prospecting ${100 - judgingEditValue}`,
      },
    ],
    [
      {
        value: 0,
        label: `Assertive ${assertiveEditValue}`,
      },
      {
        value: 100,
        label: `Turbulent ${100 - assertiveEditValue}`,
      },
    ],
  ];
  //setting the current percentage for the extraverted personality component
  const updateExtravertedValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setExtravertedEditValue(value);
  };
  //setting the current percentage for the intuitive personality component
  const updateIntuitiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setIntuitiveEditValue(value);
  };
  //setting the current percentage for the thinking personality component
  const updateThinkingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setThinkingEditValue(value);
  };
  //setting the current percentage for the judging personality component
  const updateJudgingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setJudgingEditValue(value);
  };
  //setting the current percentage for the assertive personality component
  const updateAssertiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setAssertiveEditValue(value);
  };
  //setting initial values from daabase for the logged in user,
  //called each time a new user logs in
  useEffect(() => {
    if (userLoggedIn != undefined) {
      setAnonymizeCheckbox(userLoggedIn.anonymize);
      setExtravertedEditValue(userLoggedIn.personalityComponents.extraverted);
      setIntuitiveEditValue(userLoggedIn.personalityComponents.intuitive);
      setThinkingEditValue(userLoggedIn.personalityComponents.thinking);
      setJudgingEditValue(userLoggedIn.personalityComponents.judging);
      setAssertiveEditValue(userLoggedIn.personalityComponents.assertive);
    }
  }, [userLoggedIn]);
  //calculating the group and personality type and strategy based on the percentage data of individual personality components,
  //called each time the value of any personality component changes
  useEffect(() => {
    const personalityComponentsValue = {
      extraverted: extravertedEditValue,
      intuitive: intuitiveEditValue,
      thinking: thinkingEditValue,
      judging: judgingEditValue,
      assertive: assertiveEditValue,
    };
    calcGroupTypeAndStrategy(personalityComponentsValue);
  }, [
    extravertedEditValue,
    intuitiveEditValue,
    thinkingEditValue,
    judgingEditValue,
    assertiveEditValue,
  ]);
  return (
    <>
      {showEditUser && (
        <>
          <div
            onClick={closeEditUserModalHandler}
            className={styles.overlay}
          ></div>
          <div className={styles.modal}>
            <form className={styles.form} onSubmit={formSubmissionHandler}>
              <div className={styles.menu__image}>
                <img
                  src={`/images/${editAnimalPhotoValue}.png`}
                  alt={editAnimalPhotoValue}
                />
              </div>
              <label htmlFor="animalPhoto">Animal photo:</label>
              <select
                name="animalPhoto"
                value={editAnimalPhotoValue}
                onChange={setEditAnimalPhotoHandler}
              >
                <option value="cat">Cat</option>
                <option value="crab">Crab</option>
                <option value="dolphin">Doplhin</option>
                <option value="elephant">Elephant</option>
                <option value="flamingo">Flamingo</option>
                <option value="hen">Hen</option>
                <option value="owl">Owl</option>
                <option value="panda">Panda</option>
                <option value="penguin">Penguin</option>
                <option value="squirrel">Squirrel</option>
              </select>
              <Slider
                name="mind"
                className={styles.slider}
                color="primary"
                defaultValue={50}
                sx={{ width: 250 }}
                max={100}
                min={0}
                step={1}
                marks={mark[0]}
                value={extravertedEditValue}
                onChange={updateExtravertedValueInputHandler}
              />

              <label htmlFor="energy">Energy:</label>
              <Slider
                name="energy"
                className={styles.slider}
                color="primary"
                defaultValue={50}
                sx={{ width: 250 }}
                max={100}
                min={0}
                step={1}
                marks={mark[1]}
                value={intuitiveEditValue}
                onChange={updateIntuitiveValueInputHandler}
              />
              <label htmlFor="nature">Nature:</label>
              <Slider
                name="nature"
                className={styles.slider}
                color="primary"
                defaultValue={50}
                sx={{ width: 250 }}
                max={100}
                min={0}
                step={1}
                marks={mark[2]}
                value={thinkingEditValue}
                onChange={updateThinkingValueInputHandler}
              />
              <label htmlFor="tactics">Tactics:</label>
              <Slider
                name="tactics"
                className={styles.slider}
                color="primary"
                defaultValue={50}
                sx={{ width: 250 }}
                max={100}
                min={0}
                step={1}
                marks={mark[3]}
                value={judgingEditValue}
                onChange={updateJudgingValueInputHandler}
              />
              <label htmlFor="identity">Identity:</label>
              <Slider
                name="identity"
                className={styles.slider}
                color="primary"
                defaultValue={50}
                sx={{ width: 250 }}
                max={100}
                min={0}
                step={1}
                marks={mark[4]}
                value={assertiveEditValue}
                onChange={updateAssertiveValueInputHandler}
              />
              <button className={styles.form__button}>Save</button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default TheMemberEditModal;
