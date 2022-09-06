import { Slider } from "@mui/material";
import {
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";
import styles from "./TheAddMemberModal.module.css";
import Checkbox from "@mui/material/Checkbox";

const TheAddMemberModal = (props) => {
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
  //dispatch(storeActions.closeMemberInfoModal());

  const POOL_DATA = {
    UserPoolId: "eu-central-1_TxFHYBwqN",
    ClientId: "3622gnqsgtrf9d4v3u2olfnnkf",
  };
  const userPool = new CognitoUserPool(POOL_DATA);

  async function addUser(userData) {
    const APIRequestURL = `https://zoyq4h8u8i.execute-api.eu-central-1.amazonaws.com/dev/`;
    try {
      const response = await axios.post(APIRequestURL, userData);
      dispatch(storeActions.setAddedNewUserStatus(true));
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
      //console.log(users[0].Name.S);
    } catch (error) {
      console.error(error);
    }
  }

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
    //const explorersRegex = "(I|E)S(T|F)P";

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
    console.log(personalityTypeName);
    console.log(typeName);
    setPersonalityTypeInput(personalityTypeName);
    setPersonalityGroupInput(personalityGroupName);
    setStrategyNameInput(stategyName);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    const updatedUser = {
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
    console.log("here");
    console.log(updatedUser);
    addUser(updatedUser);
    setNameInput("");
    setAnimalPhotoInput("cat");
    setPersonalityTypeInput("Architect");
    setNameIsValid(false);
    closeAddUserModalHandler();
  };

  let test = 0;

  const updateAnimalPhotoInputHandler = (e) => {
    setAnimalPhotoInput(e.target.value);
  };

  const updatePersonalityTypeInputHandler = (e) => {
    setPersonalityTypeInput(e.target.value);
  };
  const updateNameInputHandler = (e) => {
    setNameInput(e.target.value);
    if (new RegExp("(?=.{3,})").test(e.target.value)) {
      setNameIsValid(true);
    } else {
      setNameIsValid(false);
    }
  };
  const updateSelectedTeamLeaderHandler = (e) => {
    setSelectedTeamLeader(e.target.value);
  };
  const updateExtravertedValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setExtravertedValueInput(value);
  };
  const updateIntuitiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setIntuitiveValueInput(value);
  };
  const updateThinkingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setThinkingValueInput(value);
  };
  const updateJudgingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setJudgingValueInput(value);
  };
  const updateAssertiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setAssertiveValueInput(value);
  };
  useEffect(() => {
    getTeamLeaders();
  }, []);
  useEffect(() => {
    const personalityComponentsValue = {
      extraverted: extravertedValueInput,
      intuitive: intuitiveValueInput,
      thinking: thinkingValueInput,
      judging: judgingValueInput,
      assertive: assertiveValueInput,
    };
    console.log(personalityComponentsValue);
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

  async function getTeamLeaders() {
    try {
      const response = await axios.get(
        `https://zoyq4h8u8i.execute-api.eu-central-1.amazonaws.com/dev/team-leaders`
      );
      const teamLeaders = response.data.Items.map((item) => ({
        id: item.Id.S,
        name: item.Name.S,
      }));
      console.log(teamLeaders);
      setTeamLeaders(teamLeaders);

      //console.log(response.data.Items);
    } catch (error) {
      console.error(error);
    }
  }

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
                {/* <option value="Tomasz">Tomasz</option>
                <option value="Karolina">Karolina</option>
                <option value="Damian">Damian</option> */}
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
                  // valueLabelDisplay="auto"
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
              {/* <label for="personalityType">Personality Type:</label>
              <select
                name="personalityType"
                value={personalityTypeInput}
                onChange={updatePersonalityTypeInputHandler}
              >
                <option value="Architect">Architect</option>
                <option value="Logician">Logician</option>
                <option value="Commander">Commander</option>
                <option value="Debater">Debater</option>
                <option value="Advocate">Advocate</option>
                <option value="Mediator">Mediator</option>
                <option value="Protagonist">Protagonist</option>
                <option value="Campaigner">Campaigner</option>
                <option value="Logistician">Logistician</option>
                <option value="Defender">Defender</option>
                <option value="Executive">Executive</option>
                <option value="Consul">Consul</option>
                <option value="Virtuoso">Virtuoso</option>
                <option value="Adventurer">Adventurer</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Entertainer">Entertainer</option>
              </select> */}
              {/* {0 == 0 && (
                <p className={styles.form__error_info}>
                  Name must not be empty.
                </p>
              )} */}

              {/* <p className={styles.form__error_info}>Error msg</p> */}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default TheAddMemberModal;
