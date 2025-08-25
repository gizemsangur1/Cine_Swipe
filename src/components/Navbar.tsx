"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import SearchBar from "./SearchBar";
import { account, databases } from "@/lib/appwrite";
import { Button, Grid, Typography } from "@mui/material";
import MenuTypography from "./Typography/MenuTypography";
import SettingsIcon from "@mui/icons-material/Settings";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import LogoutButton from "./Buttons/Logout/LogoutButton";

export default function AuthButtons() {
  const router = useRouter();
  const { user, loading, setUser, setLoading } = useUserStore();
  const [openBox, setOpenBox] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = await account.get();

        const userDoc = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
          authUser.$id
        );

        setUser({
          id: userDoc.$id,
          email: authUser.email,
          name: userDoc.name || "",
          surname: userDoc.surname || "",
          username: userDoc.username || "",
          avatar_url: userDoc.avatar_url || "",
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [setUser, setLoading, user]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  const openSettings = async () => {
    setOpenBox(!openBox);
  };

  if (loading) {
    return <div style={{ height: 60 }}></div>;
  }

  if (user) {
    return (
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          alignItems: "center",
          backgroundColor: "transparent",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1300,
        }}
      >
        <Grid size={{ xs: 10, md: 2 }} sx={{ textAlign: "center" }}>
          <Link href="/" style={{ textDecoration: "none", color: "white" }}>
            <Typography sx={{ fontSize: "36px", fontWeight: "bold" }}>
              CineSwipe
            </Typography>
          </Link>
        </Grid>
        <Grid
          size={{ xs: 0, md: 5 }}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <SearchBar />
        </Grid>
        <Grid
          size={{ xs: 0, md: 2 }}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "end",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#ddd",
              borderRadius: "50%",
              backgroundImage: user?.avatar_url
                ? `url(${user.avatar_url})`
                : "none",
              backgroundSize: "cover",
            }}
            onClick={openSettings}
          ></div>
          {openBox && (
            <Grid
              container
              direction="column"
              sx={{
                position: "absolute",
                top: "60px",
                left: "-10px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
                color: "white",
                zIndex: 1200,
                padding: "20px",
                justifyContent: "center",
                alignItems: "center",
                minWidth: "240px",
              }}
            >
              <MenuTypography
                pageTitle={"Profile Settings"}
                page={"/settings"}
                icon={SettingsIcon}
              />
              <MenuTypography
                pageTitle={"Watch List"}
                page={"/watchlist"}
                icon={DoneIcon}
              />

              <MenuTypography
                pageTitle={"Watched List"}
                page={"/watched"}
                icon={DoneAllIcon}
              />

              <Grid size={12}>
                <LogoutButton onLogout={handleLogout} />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}
    >
      <Grid size={9}>
        <Typography
          sx={{ fontSize: "36px", fontWeight: "bold", color: "white" }}
        >
          <Link href="/" style={{ textDecoration: "none",color:"white" }}>
            CineSwipe
          </Link>
        </Typography>
      </Grid>
      <Grid size={3} sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          sx={{
            backgroundColor: "#C5172E",
            "&:hover": { backgroundColor: "#8E1616" },
            textTransform: "none",
            borderRadius: "25px",
            color: "white",
            width: "75px",
            marginRight:"10px",
          }}
          onClick={() => router.push("/auth/signin")}
        >
          Login
        </Button>

        <Button
          sx={{
            backgroundColor: "#C5172E",
            "&:hover": { backgroundColor: "#8E1616" },
            textTransform: "none",
            borderRadius: "25px",
            color: "white",
            width: "75px",
            marginLeft:"10px"
          }}
          onClick={() => router.push("/auth/register")}
        >
          Register
        </Button>
      </Grid>
    </Grid>
  );
}
