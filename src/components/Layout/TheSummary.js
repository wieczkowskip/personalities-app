import styles from "./TheSummary.module.css";
import summary from "../../assets/team.jpg";
import TheDeleteMemberModal from "../Modals/TheDeleteMemberModal";
import { useDispatch, useSelector } from "react-redux";
import { storeActions } from "../Store";
import { useEffect, useState } from "react";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import axios from "axios";
const TheSummary = (props) => {
  const users = useSelector((state) => state.usersForSummary);

  const POOL_DATA = {
    UserPoolId: "eu-central-1_TxFHYBwqN",
    ClientId: "3622gnqsgtrf9d4v3u2olfnnkf",
  };
  const userPool = new CognitoUserPool(POOL_DATA);

  const checkAdmin = () => {
    const user = userPool.getCurrentUser();
    if (user != null) {
      user.getSession((err, session) => {
        if (err) {
          console.log("no session: " + err);
        } else {
          console.log(user);
          console.log(session);
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

  const showAddMemberModalHandler = () => {
    dispatch(storeActions.showAddUserModal());
  };
  const showDeleteMemberModalHandler = () => {
    dispatch(storeActions.showDeleteUserModal());
  };

  const selectSummaryTopic = (numberOfTopic) => {
    setSelectedSummaryTopic(numberOfTopic);
  };
  const setSelectedTeamLeader = (e) => {
    dispatch(storeActions.setSelectedTeamLeader(e.target.value));
  };

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
  const calcPercentageOfThePersonalityTypeComponent = (userData) => {
    console.log(userData);
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

  async function getTeamLeaders() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URL}/team-leaders`
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
  useEffect(() => {
    checkAdmin();
    getTeamLeaders();

    if (users.length > 0) {
      calcPercentageOfThePersonalityTypeComponent(users);
      calcAmountOfWorkMembersInPersonalityGroups(users);
      calcAmountOfWorkMembersInPersonalityTypes(users);
    }
  }, [nameOfUserLoggedIn, users]);
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
                  {/* <option value="">Tomasz</option>
                  <option value="lstvxr">Karolina</option>
                  <option value="fszlao">Damian</option> */}
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
