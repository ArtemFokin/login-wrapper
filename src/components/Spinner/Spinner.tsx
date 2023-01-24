import styles from "./styles.module.css";

const Spinner = () => {
  return (
    <div className={styles.container}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        />
      </svg>
    </div>
  );
};

export default Spinner;
