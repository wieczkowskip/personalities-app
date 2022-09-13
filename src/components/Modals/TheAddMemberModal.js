import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";
import { Slider } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import styles from "./TheAddMemberModal.module.css";
//the module contains a modal in which a user with administrator right can add a new user
const TheAddMemberModal = () => {
  const axios = require("axios").default;

  const showAddUser = useSelector((state) => state.showAddUser);

  const [nameIsValid, setNameIsValid] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [selectedTeamLeader, setSelectedTeamLeader] = useState("Tomasz");
  const [extravertedValueInput, setExtravertedValueInput] = useState(50);
  const [intuitiveValueInput, setIntuitiveValueInput] = useState(50);
  const [thinkingValueInput, setThinkingValueInput] = useState(50);
  const [judgingValueInput, setJudgingValueInput] = useState(50);
  const [assertiveValueInput, setAssertiveValueInput] = useState(50);
  const [animalPhotoInput, setAnimalPhotoInput] = useState("cat");
  const [personalityGroupInput, setPersonalityGroupInput] =
    useState("Explorers");
  const [personalityTypeInput, setPersonalityTypeInput] =
    useState("Adventurer");
  const [strategyNameInput, setStrategyNameInput] = useState(
    "Constant Improvement"
  );
  const [anonymizeInput, setAnonymizeInput] = useState(false);

  const [teamLeaders, setTeamLeaders] = useState([]);

  const dispatch = useDispatch();

  //close TheAddMemberModal modal and set default values
  const closeAddUserModalHandler = () => {
    dispatch(storeActions.closeAddUserModal());
    setNameIsValid(false);
    setNameInput("");
    setExtravertedValueInput(50);
    setIntuitiveValueInput(50);
    setThinkingValueInput(50);
    setJudgingValueInput(50);
    setAssertiveValueInput(50);
    setAnimalPhotoInput("cat");
    setPersonalityGroupInput("Explorers");
    setPersonalityTypeInput("Adventurer");
    setStrategyNameInput("Constant Improvement");
    setAnonymizeInput(false);
  };
  //adding a new team member to the database
  async function addUser(userData) {
    const APIRequestURL = process.env.REACT_APP_API_SERVER_URL;
    try {
      const response = await axios.post(APIRequestURL, userData);
      dispatch(storeActions.setAddedNewUserStatus(true));
    } catch (error) {
      console.error(error);
    }
  }
  //calculating the group, personality type and strategy based on the percentages of individual personality components and
  //assigning the calculated values to the appropriate variables
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
  //adding a new team member, setting default values for the form and closing the modal
  const formSubmissionHandler = (event) => {
    event.preventDefault();
    const newUser = {
      anonymize: +anonymizeInput,
      memberId: nameInput.toLowerCase(),
      name: nameInput,
      teamLeader: selectedTeamLeader,
      animalPhoto: animalPhotoInput,
      personalityType: personalityTypeInput,
      personalityGroup: personalityGroupInput,
      strategy: strategyNameInput,
      extraverted: extravertedValueInput,
      intuitive: intuitiveValueInput,
      thinking: thinkingValueInput,
      judging: judgingValueInput,
      assertive: assertiveValueInput,
    };
    addUser(newUser);
    setNameInput("");
    setAnimalPhotoInput("cat");
    setPersonalityTypeInput("Architect");
    setNameIsValid(false);
    closeAddUserModalHandler();
  };
  //setting a selected avatar in the form for adding a new team member
  const updateAnimalPhotoInputHandler = (e) => {
    setAnimalPhotoInput(e.target.value);
  };
  //setting a selected name in the form for adding a new team member and checking the correctness of the name
  const updateNameInputHandler = (e) => {
    setNameInput(e.target.value);
    if (new RegExp("(?=.{3,})").test(e.target.value)) {
      setNameIsValid(true);
    } else {
      setNameIsValid(false);
    }
  };
  //setting a selected team leader in the form for adding a new team member
  const updateSelectedTeamLeaderHandler = (e) => {
    setSelectedTeamLeader(e.target.value);
  };
  //setting a selected percentage for a extraverted component in the form for adding a new team member
  const updateExtravertedValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setExtravertedValueInput(value);
  };
  //setting a selected percentage for a intuitive component in the form for adding a new team member
  const updateIntuitiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setIntuitiveValueInput(value);
  };
  //setting a selected percentage for a thinking component in the form for adding a new team member
  const updateThinkingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setThinkingValueInput(value);
  };
  //setting a selected percentage for a judging component in the form for adding a new team member
  const updateJudgingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setJudgingValueInput(value);
  };
  //setting a selected percentage for a assertive component in the form for adding a new team member
  const updateAssertiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setAssertiveValueInput(value);
  };
  //getting a list of team leaders from the database after switching on the modal
  useEffect(() => {
    getTeamLeaders();
  }, []);
  //calculation of the group, personality type and strategy after each change in the percentage of the personality components
  useEffect(() => {
    const personalityComponentsValue = {
      extraverted: extravertedValueInput,
      intuitive: intuitiveValueInput,
      thinking: thinkingValueInput,
      judging: judgingValueInput,
      assertive: assertiveValueInput,
    };
    calcGroupTypeAndStrategy(personalityComponentsValue);
  }, [
    extravertedValueInput,
    intuitiveValueInput,
    thinkingValueInput,
    judgingValueInput,
    assertiveValueInput,
  ]);

  const mark = [
    [
      {
        value: 0,
        label: `Extraverted ${extravertedValueInput}`,
      },
      {
        value: 100,
        label: `Introverted ${100 - extravertedValueInput}`,
      },
    ],
    [
      {
        value: 0,
        label: `Intuitive ${intuitiveValueInput}`,
      },
      {
        value: 100,
        label: `Observant ${100 - intuitiveValueInput}`,
      },
    ],
    [
      {
        value: 0,
        label: `Thinking ${thinkingValueInput}`,
      },
      {
        value: 100,
        label: `Feeling ${100 - thinkingValueInput}`,
      },
    ],
    [
      {
        value: 0,
        label: `Judging ${judgingValueInput}`,
      },
      {
        value: 100,
        label: `Prospecting ${100 - judgingValueInput}`,
      },
    ],
    [
      {
        value: 0,
        label: `Assertive ${assertiveValueInput}`,
      },
      {
        value: 100,
        label: `Turbulent ${100 - assertiveValueInput}`,
      },
    ],
  ];

  //getting a list of team leaders from the database
  async function getTeamLeaders() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URL}/team-leaders`
      );
      const teamLeaders = response.data.Items.map((item) => ({
        id: item.Id.S,
        name: item.Name.S,
      }));
      setTeamLeaders(teamLeaders);
    } catch (error) {
      console.error(error);
    }
  }

  //changing the data anonymization option in the form
  const changeAnonymizeInput = () => {
    setAnonymizeInput(!anonymizeInput);
  };

  return (
    <>
      {showAddUser && (
        <>
          <div
            onClick={closeAddUserModalHandler}
            className={styles.overlay}
          ></div>
          <div className={styles.modal}>
            <form
              className={styles.form__inputs}
              onSubmit={formSubmissionHandler}
            >
              <h3>Add user</h3>
              <label htmlFor="name">Name: (3+ characters)</label>
              <input
                name="name"
                className={
                  !nameIsValid
                    ? `${styles["form__input--error"]} ${styles["form__input"]}`
                    : `${styles["form__input"]}`
                }
                type="text"
                value={nameInput}
                onChange={updateNameInputHandler}
              />

              <div className={styles.form__checkbox}>
                <label htmlFor="anonymize">Hide user:</label>
                <Checkbox
                  checked={anonymizeInput}
                  onChange={changeAnonymizeInput}
                />
              </div>
              <label htmlFor="teamLeader">Team leader:</label>
              <select
                name="teamLeader"
                className={styles.form__select}
                value={selectedTeamLeader}
                onChange={updateSelectedTeamLeaderHandler}
              >
                {teamLeaders.map((item) => (
                  <>
                    <option value={item.id}>{item.name}</option>
                  </>
                ))}
              </select>
              <div className={styles.menu__image}>
                <img
                  src={`/images/${animalPhotoInput}.png`}
                  alt={animalPhotoInput}
                />
              </div>
              <label htmlFor="animalPhoto">Animal photo:</label>
              <select
                name="animalPhoto"
                className={styles.form__select}
                value={animalPhotoInput}
                onChange={updateAnimalPhotoInputHandler}
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
              <button className={styles.form__button} disabled={!nameIsValid}>
                Add
              </button>
              <div className={styles.form__sliders}>
                <label htmlFor="mind">Mind:</label>

                <Slider
                  name="mind"
                  class={styles.slider}
                  color="primary"
                  defaultValue={50}
                  sx={{ width: 250 }}
                  max={100}
                  min={0}
                  step={1}
                  marks={mark[0]}
                  value={extravertedValueInput}
                  onChange={updateExtravertedValueInputHandler}
                />

                <label htmlFor="energy">Energy:</label>
                <Slider
                  name="energy"
                  class={styles.slider}
                  color="primary"
                  defaultValue={50}
                  sx={{ width: 250 }}
                  max={100}
                  min={0}
                  step={1}
                  marks={mark[1]}
                  value={intuitiveValueInput}
                  onChange={updateIntuitiveValueInputHandler}
                />
                <label htmlFor="nature">Nature:</label>
                <Slider
                  name="nature"
                  class={styles.slider}
                  color="primary"
                  defaultValue={50}
                  sx={{ width: 250 }}
                  max={100}
                  min={0}
                  step={1}
                  marks={mark[2]}
                  value={thinkingValueInput}
                  onChange={updateThinkingValueInputHandler}
                />
                <label htmlFor="tactics">Tactics:</label>
                <Slider
                  name="tactics"
                  class={styles.slider}
                  color="primary"
                  defaultValue={50}
                  sx={{ width: 250 }}
                  max={100}
                  min={0}
                  step={1}
                  marks={mark[3]}
                  value={judgingValueInput}
                  onChange={updateJudgingValueInputHandler}
                />
                <label htmlFor="identity">Identity:</label>
                <Slider
                  name="identity"
                  class={styles.slider}
                  color="primary"
                  defaultValue={50}
                  sx={{ width: 250 }}
                  max={100}
                  min={0}
                  step={1}
                  marks={mark[4]}
                  value={assertiveValueInput}
                  onChange={updateAssertiveValueInputHandler}
                />
              </div>
              <h3>Group: {personalityGroupInput}</h3>
              <h3>Type: {personalityTypeInput}</h3>
              <h3>Strategy: {strategyNameInput}</h3>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default TheAddMemberModal;
