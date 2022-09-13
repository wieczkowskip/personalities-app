import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeActions } from "../Store";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import axios from "axios";

import summary from "../../assets/team.jpg";

import TheDeleteMemberModal from "../Modals/TheDeleteMemberModal";

import styles from "./TheSummary.module.css";
//the module contains the entire "summary" section
const TheSummary = () => {
  const users = useSelector((state) => state.usersForSummary);

  const POOL_DATA = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(POOL_DATA);

  //checking if the logged in user has administrator rights
  const checkAdmin = () => {
    const user = userPool.getCurrentUser();
    if (user != null) {
      user.getSession((err, session) => {
        if (err) {
          console.error("no session: " + err);
        } else {
          if (
            user.getSignInUserSession().getAccessToken().payload[
              "cognito:groups"
            ] !== undefined
          ) {
            user
              .getSignInUserSession()
              .getAccessToken()
              .payload["cognito:groups"].includes("admin")
              ? setCheckAdminValue(true)
              : user
                  .getSignInUserSession()
                  .getAccessToken()
                  .payload["cognito:groups"].includes("teamLeader")
              ? setCheckAdminValue(true)
              : setCheckAdminValue(false);
          } else {
            setCheckAdminValue(false);
          }
        }
      });
    }
  };

  const [checkAdminValue, setCheckAdminValue] = useState(false);
  const [selectedSummaryTopic, setSelectedSummaryTopic] = useState(1);
  const [extravertedAvg, setExtravertedAvg] = useState();
  const [intuitiveAvg, setIntuitiveAvg] = useState();
  const [thinkingAvg, setThinkingAvg] = useState();
  const [judgingAvg, setJudgingAvg] = useState();
  const [assertiveAvg, setAssertiveAvg] = useState();
  const [teamLeaders, setTeamLeaders] = useState([]);

  const [personalityGroupsAmount, setPersonalityGroupsAmount] = useState([
    { name: "Analysts", amount: 0 },
    { name: "Sentinels", amount: 0 },
    { name: "Explorers", amount: 0 },
    { name: "Diplomats", amount: 0 },
  ]);
  const [personalityTypesAmount, setPersonalityTypesAmount] = useState([]);
  const dispatch = useDispatch();
  const nameOfUserLoggedIn = useSelector((state) => state.nameOfUserLoggedIn);
  const selectedTeamLeader = useSelector((state) => state.selectedTeamLeader);

  //TheAddMemberModal display support
  const showAddMemberModalHandler = () => {
    dispatch(storeActions.showAddUserModal());
  };
  //TheDeleteMemberModal display support
  const showDeleteMemberModalHandler = () => {
    dispatch(storeActions.showDeleteUserModal());
  };
  //change of the current topic regarding the team summary
  const selectSummaryTopic = (numberOfTopic) => {
    setSelectedSummaryTopic(numberOfTopic);
  };
  //change of the currently selected team leader
  const setSelectedTeamLeader = (e) => {
    dispatch(storeActions.setSelectedTeamLeader(e.target.value));
  };
  //setting the current user list in the usersForSummary[] variable in redux store
  const setUsersForSummary = (value) => {
    dispatch(storeActions.setUsersForSummary(value));
  };
  //calculating the average percentage of the selected personality component
  const componentAvgValue = (userData, componentName) => {
    return Math.round(
      (userData
        .map((item) =>
          +item.personalityComponents[componentName] >= 50 ? 1 : 0
        )
        .reduce((a, b) => a + b) /
        userData.length) *
        100
    );
  };
  //calculating the average percentage of all personality components and setting them to the appropriate variables
  const calcPercentageOfThePersonalityTypeComponent = (userData) => {
    const extravertedAvgValue = componentAvgValue(userData, "extraverted");
    const intuitiveAvgValue = componentAvgValue(userData, "intuitive");
    const thinkingAvgValue = componentAvgValue(userData, "thinking");
    const judgingAvgValue = componentAvgValue(userData, "judging");
    const assertiveAvgValue = componentAvgValue(userData, "assertive");
    setExtravertedAvg(extravertedAvgValue);
    setIntuitiveAvg(intuitiveAvgValue);
    setThinkingAvg(thinkingAvgValue);
    setJudgingAvg(judgingAvgValue);
    setAssertiveAvg(assertiveAvgValue);
  };
  //calculating the sum of team members based on personality groups
  const calcAmountOfWorkMembersInPersonalityGroups = (userData) => {
    const sentinels = userData
      .map((item) => (item.personalityGroup === "Sentinels" ? 1 : 0))
      .reduce((a, b) => a + b);
    const explorers = userData
      .map((item) => (item.personalityGroup === "Explorers" ? 1 : 0))
      .reduce((a, b) => a + b);
    const diplomats = userData
      .map((item) => (item.personalityGroup === "Diplomats" ? 1 : 0))
      .reduce((a, b) => a + b);
    const analysts = userData
      .map((item) => (item.personalityGroup === "Analysts" ? 1 : 0))
      .reduce((a, b) => a + b);
    const personalityGroups = [
      { name: "Analysts", amount: analysts },
      { name: "Sentinels", amount: sentinels },
      { name: "Explorers", amount: explorers },
      { name: "Diplomats", amount: diplomats },
    ].sort((a, b) => b.amount - a.amount);
    setPersonalityGroupsAmount(personalityGroups);
  };
  //calculating the sum of team members based on personality types
  const calcAmountOfWorkMembersInPersonalityTypes = (userData) => {
    const architect = userData
      .map((item) => (item.personalityType === "Architect" ? 1 : 0))
      .reduce((a, b) => a + b);
    const logician = userData
      .map((item) => (item.personalityType === "Logician" ? 1 : 0))
      .reduce((a, b) => a + b);
    const commander = userData
      .map((item) => (item.personalityType === "Commander" ? 1 : 0))
      .reduce((a, b) => a + b);
    const debater = userData
      .map((item) => (item.personalityType === "Debater" ? 1 : 0))
      .reduce((a, b) => a + b);
    const advocate = userData
      .map((item) => (item.personalityType === "Advocate" ? 1 : 0))
      .reduce((a, b) => a + b);
    const mediator = userData
      .map((item) => (item.personalityType === "Mediator" ? 1 : 0))
      .reduce((a, b) => a + b);
    const protagonist = userData
      .map((item) => (item.personalityType === "Protagonist" ? 1 : 0))
      .reduce((a, b) => a + b);
    const campaigner = userData
      .map((item) => (item.personalityType === "Campaigner" ? 1 : 0))
      .reduce((a, b) => a + b);
    const logistician = userData
      .map((item) => (item.personalityType === "Logistician" ? 1 : 0))
      .reduce((a, b) => a + b);
    const defender = userData
      .map((item) => (item.personalityType === "Defender" ? 1 : 0))
      .reduce((a, b) => a + b);
    const executive = userData
      .map((item) => (item.personalityType === "Executive" ? 1 : 0))
      .reduce((a, b) => a + b);
    const consul = userData
      .map((item) => (item.personalityType === "Consul" ? 1 : 0))
      .reduce((a, b) => a + b);
    const virtuoso = userData
      .map((item) => (item.personalityType === "Virtuoso" ? 1 : 0))
      .reduce((a, b) => a + b);
    const adventurer = userData
      .map((item) => (item.personalityType === "Adventurer" ? 1 : 0))
      .reduce((a, b) => a + b);
    const entrepreneur = userData
      .map((item) => (item.personalityType === "Entrepreneur" ? 1 : 0))
      .reduce((a, b) => a + b);
    const entertainer = userData
      .map((item) => (item.personalityType === "Entertainer" ? 1 : 0))
      .reduce((a, b) => a + b);

    const personalityTypes = [
      { name: "Architect", amount: architect },
      { name: "Logician", amount: logician },
      { name: "Commander", amount: commander },
      { name: "Debater", amount: debater },
      { name: "Advocate", amount: advocate },
      { name: "Mediator", amount: mediator },
      { name: "Protagonist", amount: protagonist },
      { name: "Campaigner", amount: campaigner },
      { name: "Logistician", amount: logistician },
      { name: "Defender", amount: defender },
      { name: "Executive", amount: executive },
      { name: "Consul", amount: consul },
      { name: "Virtuoso", amount: virtuoso },
      { name: "Adventurer", amount: adventurer },
      { name: "Entrepreneur", amount: entrepreneur },
      { name: "Entertainer", amount: entertainer },
    ].sort((a, b) => b.amount - a.amount);
    setPersonalityTypesAmount(personalityTypes);
  };
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
  //getting a list of team members based on the selected team leader,
  //store the result in the usersForSummary[] variable in redux
  async function getUsersForSummary(currentUsername, teamLeader) {
    let APIRequestURL = "";
    if (teamLeader == "" || teamLeader == "ypzzol") {
      APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}`;
    } else {
      APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/current-username/${currentUsername}/team-leader/${teamLeader}`;
    }

    try {
      const response = await axios.get(APIRequestURL);
      setUsersForSummary(
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
  //checking if the logged in user has administrator rights and getting the list of team leaders from databse each time a new user logs in
  useEffect(() => {
    checkAdmin();
    getTeamLeaders();
  }, [nameOfUserLoggedIn]);
  //getting the team members list based on the team leader each time a new user logs in or the team leader is changed
  useEffect(() => {
    getUsersForSummary(nameOfUserLoggedIn.toLowerCase(), selectedTeamLeader);
  }, [nameOfUserLoggedIn, selectedTeamLeader]);
  //calculating all needed values for the team summary section after each change of the team member list
  useEffect(() => {
    if (users.length > 0) {
      calcPercentageOfThePersonalityTypeComponent(users);
      calcAmountOfWorkMembersInPersonalityGroups(users);
      calcAmountOfWorkMembersInPersonalityTypes(users);
    }
  }, [users]);
  return (
    <>
      <TheDeleteMemberModal />
      <div id="summary" className={styles.summary}>
        <div className={styles.summary__info}>
          <h1>Summary of personalities of our team</h1>
          {nameOfUserLoggedIn === "" && (
            <h2>You need to sign in to see this.</h2>
          )}
          {nameOfUserLoggedIn !== "" && (
            <>
              <div className={styles.filters__settings}>
                <h3>Team leader:</h3>
                <select
                  name="teamLeader"
                  value={selectedTeamLeader}
                  onChange={setSelectedTeamLeader}
                >
                  <option value="">--None--</option>
                  {teamLeaders.map((item) => (
                    <>
                      <option value={item.id}>{item.name}</option>
                    </>
                  ))}
                </select>
              </div>
              <p>
                Our team consists of {users.length} people. Everyone is
                different, but there are some similarities within our team. The
                predominant personality traits of our team are:{" "}
                {extravertedAvg >= 50 ? "extraverted" : "introverted"},{" "}
                {intuitiveAvg >= 50 ? "intuitive" : "observant"},{" "}
                {thinkingAvg >= 50 ? "thinking" : "feeling"},{" "}
                {judgingAvg >= 50 ? "judging" : "prospecting"} and{" "}
                {assertiveAvg >= 50 ? "assertive" : "turbulent"}. Personality
                types contain their respective personality group. There are 4
                personality groups: analysts, diplomats, sentinels, and
                explorers. The most numerous group in our team is{" "}
                {personalityGroupsAmount[0].name},{" "}
                {personalityGroupsAmount[0].amount} out of {users.length} people
                belong to this personality group. More detailed information is
                below.
              </p>
              <div className={styles.summary__topics}>
                <div
                  onClick={selectSummaryTopic.bind(this, 1)}
                  className={
                    selectedSummaryTopic === 1
                      ? `${styles["summary__topic"]} ${styles["summary__topic--active"]}`
                      : `${styles["summary__topic"]}`
                  }
                >
                  1
                </div>
                <div
                  onClick={selectSummaryTopic.bind(this, 2)}
                  className={
                    selectedSummaryTopic === 2
                      ? `${styles["summary__topic"]} ${styles["summary__topic--active"]}`
                      : `${styles["summary__topic"]}`
                  }
                >
                  2
                </div>
                <div
                  onClick={selectSummaryTopic.bind(this, 3)}
                  className={
                    selectedSummaryTopic === 3
                      ? `${styles["summary__topic"]} ${styles["summary__topic--active"]}`
                      : `${styles["summary__topic"]}`
                  }
                >
                  3
                </div>
              </div>
              {selectedSummaryTopic === 1 && (
                <div className={styles.topic__info}>
                  <h3>
                    Percentage of the personality type component in the team:
                  </h3>
                  <p>
                    Extraverted {extravertedAvg}% - {100 - extravertedAvg}%
                    Introverted
                  </p>
                  <p>
                    Intuitive {intuitiveAvg}% - {100 - intuitiveAvg}% Observant
                  </p>
                  <p>
                    Thinking {thinkingAvg}% - {100 - thinkingAvg}% Feeling
                  </p>
                  <p>
                    Judging {judgingAvg}% - {100 - judgingAvg}% Prospecting
                  </p>
                  <p>
                    Assertive {assertiveAvg}% - {100 - assertiveAvg}% Turbulent
                  </p>
                </div>
              )}
              {selectedSummaryTopic === 2 && (
                <div className={styles.topic__info}>
                  <h3>Our team in relation to personality groups:</h3>
                  {personalityGroupsAmount.map(
                    (item) =>
                      item.amount > 0 && (
                        <p>
                          {item.name} - {item.amount} member
                          {item.amount > 1 && "s"} (
                          {Math.round((item.amount / users.length) * 100)}
                          %)
                        </p>
                      )
                  )}
                </div>
              )}
              {selectedSummaryTopic === 3 && (
                <div className={styles.topic__info}>
                  <h3>Our team in relation to personality types:</h3>
                  {personalityTypesAmount.map(
                    (item) =>
                      item.amount > 0 && (
                        <p>
                          {item.name} - {item.amount} member
                          {item.amount > 1 && "s"} (
                          {Math.round((item.amount / users.length) * 100)}%)
                        </p>
                      )
                  )}
                </div>
              )}
              {checkAdminValue && (
                <div className={styles.buttons}>
                  <button
                    className={styles.button}
                    onClick={showAddMemberModalHandler}
                  >
                    Add user
                  </button>
                  <button
                    className={styles.button}
                    onClick={showDeleteMemberModalHandler}
                  >
                    Delete user
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.summary__image}>
          <img src={summary} alt="summary" />
        </div>
      </div>
    </>
  );
};

export default TheSummary;
