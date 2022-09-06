import styles from "./TheIntroduction.module.css";
import introduction from "../../assets/personalities.jpg";
import { Link } from "react-scroll";
const TheIntroduction = (props) => {
  return (
    <div id="personalities" className={styles.introduction}>
      <div className={styles.introduction__info}>
        <h1>Our Personalities</h1>
        <h2>
          Explore our personalities and find out more about us down below.
        </h2>
        <Link
          to="summary"
          spy={true}
          smooth={true}
          offset={50}
          duration={500}
          className={styles.info__button}
        >
          Explore our personalities
        </Link>
      </div>
      <div className={styles.introduction__image}>
        <img src={introduction} alt="introduction" />
      </div>
    </div>
  );
};

export default TheIntroduction;
