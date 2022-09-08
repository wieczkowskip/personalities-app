import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";
import styles from "./TheMemberEditModal.module.css";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";

const TheMemberEditModal = (props) => {
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
  const typeOfUserLoggedIn = useSelector((state) => state.typeOfUserLoggedIn);
  const animalPhotoOfUserLoggedIn = useSelector(
    (state) => state.animalPhotoOfUserLoggedIn
  );
  const [editTypeValue, setEditTypeValue] = useState("");
  const [editAnimalPhotoValue, setEditAnimalPhotoValue] = useState("");

  useEffect(() => {
    setEditTypeValue(typeOfUserLoggedIn);
  }, [typeOfUserLoggedIn]);
  useEffect(() => {
    setEditAnimalPhotoValue(animalPhotoOfUserLoggedIn);
  }, [animalPhotoOfUserLoggedIn]);

  const dispatch = useDispatch();
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
  //dispatch(storeActions.closeMemberInfoModal());

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

  async function updateUser(currentUsername, newUserData) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/member/${newUserData.id}`;
    try {
      const response = await axios.put(APIRequestURL, newUserData);
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
      dispatch(storeActions.setEditUserStatus(true));
      //console.log(users[0].Name.S);
    } catch (error) {
      console.error(error);
    }
  }

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
    console.log(updatedUser);
    dispatch(
      storeActions.setAnimalPhotoOfUserLoggedIn(updatedUser.animalPhoto)
    );
    dispatch(storeActions.setTypeOfUserLoggedIn(updatedUser.personalityType));
    updateUser(nameOfUserLoggedIn.toLowerCase(), updatedUser);
    closeEditUserModalHandler();
  };

  const setEditAnimalPhotoHandler = (e) => {
    setEditAnimalPhotoValue(e.target.value);
  };

  const setEditTypeHandler = (e) => {
    setEditTypeValue(e.target.value);
  };
  const users = useSelector((state) => state.users);
  const userLoggedIn = users.find(
    (item) => item.userId === nameOfUserLoggedIn.toLowerCase()
  );
  console.log(users);
  console.log(userLoggedIn);

  const changeAnonymizeCheckbox = () => {
    setAnonymizeCheckbox(!anonymizeCheckbox);
  };

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

  const updateExtravertedValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setExtravertedEditValue(value);
  };
  const updateIntuitiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setIntuitiveEditValue(value);
  };
  const updateThinkingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setThinkingEditValue(value);
  };
  const updateJudgingValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setJudgingEditValue(value);
  };
  const updateAssertiveValueInputHandler = (e) => {
    const value = Math.max(0, Math.min(100, e.target.value));
    setAssertiveEditValue(value);
  };
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
  useEffect(() => {
    const personalityComponentsValue = {
      extraverted: extravertedEditValue,
      intuitive: intuitiveEditValue,
      thinking: thinkingEditValue,
      judging: judgingEditValue,
      assertive: assertiveEditValue,
    };
    console.log(personalityComponentsValue);
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
              {/* {anonymizeCheckbox.toString()}
              {extravertedEditValue}
              {intuitiveEditValue}
              {thinkingEditValue}
              {judgingEditValue}
              {assertiveEditValue}
              {personalityTypeInput}
              {personalityGroupInput}
              {strategyNameInput} */}
              {/* <Checkbox
                checked={anonymizeCheckbox}
                onChange={changeAnonymizeCheckbox}
              /> */}
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
                // valueLabelDisplay="auto"
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
