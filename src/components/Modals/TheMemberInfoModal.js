import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../Store";

import styles from "./TheMemberInfoModal.module.css";
//modal displays detailed information about the selected team member
const TheMemberInfoModal = () => {
  const [selectedSummaryTopic, setSelectedSummaryTopic] = useState(1);

  const showMemberInfo = useSelector((state) => state.showMemberInfo);
  const memberName = useSelector((state) => state.nameOfClickedMember);
  const memberAnimalPhoto = useSelector(
    (state) => state.animalPhotoOfClickedMember
  );
  const clickedUser = useSelector((state) => state.users).filter(
    (item) => item.name === memberName
  )[0];
  const memberGroup = useSelector((state) => state.groupOfClickedMember);
  const memberType = useSelector((state) => state.typeOfClickedMember);
  const memberStrategy = useSelector((state) => state.strategyOfClickedMember);
  const [personalityTypeDescription, setPersonalityTypeDescription] =
    useState("");

  const dispatch = useDispatch();

  //closing the modal
  const closeMemberInfoModalHandler = () => {
    dispatch(storeActions.closeMemberInfoModal());
  };

  const axios = require("axios").default;

  //getting a personality type description from the database and displaying it in the modal
  async function getPersonalityTypeDescription(personalityType) {
    const APIRequestURL = `${process.env.REACT_APP_API_SERVER_URL}/personality-type-description/${personalityType}`;
    try {
      const response = await axios.get(APIRequestURL);
      const description = response.data.Item.Description.S;
      setPersonalityTypeDescription(description);
    } catch (error) {
      console.error(error);
    }
  }
  //setting the currently selected topic by a user
  const selectSummaryTopic = (topicNumber) => {
    setSelectedSummaryTopic(topicNumber);
  };
  //getting a personality type description from the database and selecting first summary topic about selected team member,
  //called each time the personality type of a selected team member changes
  useEffect(() => {
    if (memberType != "") {
      getPersonalityTypeDescription(memberType);
    }
    selectSummaryTopic(1);
  }, [memberType]);

  return (
    <>
      {showMemberInfo && (
        <>
          <div
            onClick={closeMemberInfoModalHandler}
            className={styles.overlay}
          ></div>
          <div
            className={`${styles["results__item"]} ${
              styles[memberGroup.toLowerCase()]
            }`}
          >
            <div className={styles.results__image}>
              <img
                src={`/images/${memberAnimalPhoto}.png`}
                alt={memberAnimalPhoto}
              />
            </div>
            <h2>{`${memberName}`}</h2>

            <div className={styles.summary__topics}>
              <div
                onClick={selectSummaryTopic.bind(this, 1)}
                className={
                  selectedSummaryTopic === 1
                    ? `${styles["summary__topic"]} ${styles["summary__topic--active"]}`
                    : `${styles["summary__topic"]}`
                }
              >
                Personality details
              </div>
              <div
                onClick={selectSummaryTopic.bind(this, 2)}
                className={
                  selectedSummaryTopic === 2
                    ? `${styles["summary__topic"]} ${styles["summary__topic--active"]}`
                    : `${styles["summary__topic"]}`
                }
              >
                Personality type description
              </div>
            </div>
            {selectedSummaryTopic === 1 && (
              <>
                <h4>Mind</h4>
                <h5>
                  This trait determines how we interact with our environment.
                </h5>
                <h4>{`Extraverted ${clickedUser.personalityComponents.extraverted}% - ${clickedUser.personalityComponents.introverted}% Introverted`}</h4>
                <h4>Energy</h4>
                <h5>This trait shows where we direct our mental energy.</h5>
                <h4>{`Intuitive ${clickedUser.personalityComponents.intuitive}% - ${clickedUser.personalityComponents.observant}% Observant`}</h4>
                <h4>Nature</h4>
                <h5>
                  This trait determines how we make decisions and cope with
                  emotions.
                </h5>
                <h4>{`Thinking ${clickedUser.personalityComponents.thinking}% - ${clickedUser.personalityComponents.feeling}% Feeling`}</h4>
                <h4>Tactics</h4>
                <h5>
                  This trait reflects our approach to work, planning and
                  decision-making.
                </h5>
                <h4>{`Judging ${clickedUser.personalityComponents.judging}% - ${clickedUser.personalityComponents.prospecting}% Prospecting`}</h4>
                <h4>Identity</h4>
                <h5>
                  This trait underpins all others, showing how confident we are
                  in our abilities and decisions.
                </h5>
                <h4>{`Assertive ${clickedUser.personalityComponents.assertive}% - ${clickedUser.personalityComponents.turbulent}% Turbulent`}</h4>
              </>
            )}
            {selectedSummaryTopic === 2 && (
              <>
                <h3>{`Group: ${memberGroup}`}</h3>
                <h3>{`Type: ${memberType}`}</h3>
                <h3>{`Strategy: ${memberStrategy}`}</h3>
                <p>{personalityTypeDescription}</p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TheMemberInfoModal;
