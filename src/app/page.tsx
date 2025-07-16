import styles from "./page.module.css";
import MainPage from "@/components/MainPage";

export default function Home() {
  return (
    <div className={styles.page}>
     <MainPage/>
    </div>
  );
}
