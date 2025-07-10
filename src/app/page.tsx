import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import MainPage from "@/components/MainPage";

export default function Home() {
  return (
    <div className={styles.page}>
     <Navbar/>
     <MainPage/>
    </div>
  );
}
