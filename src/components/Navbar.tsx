"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import SearchBar from "./SearchBar";
import { account, databases } from "@/lib/appwrite";
import { Button,  Grid, Typography } from "@mui/material";
import MenuTypography from "./Typography/MenuTypography";
import SettingsIcon from '@mui/icons-material/Settings';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';

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
          padding: "10px",
          alignItems: "center",
          backgroundColor:"transparent"
        }}
      >
        <Grid size={2} sx={{ textAlign: "center" }}>
          <Link href="/" style={{ textDecoration: "none", color: "black" }}>
            <Typography sx={{ fontSize: "36px", fontWeight: "bold" }}>
              CineSwipe
            </Typography>
          </Link>
        </Grid>
        <Grid size={5}>
          <SearchBar />
        </Grid>
        <Grid
          size={2}
          sx={{
            display: "flex",
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
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
                color: "white",
                zIndex: 1200,
                padding:"10px",
                justifyContent:"center",
                alignItems:"center",
                minWidth:"240px"
              }}
            >
              <MenuTypography
                pageTitle={"Profile Settings"}
                page={"/settings"}
                icon={SettingsIcon}
              />
              <MenuTypography pageTitle={"Watch List"} page={"/watchlist"} icon={DoneIcon}/>

              <MenuTypography
                pageTitle={"Watched List"}
                page={"/watchedlist"}
                icon={DoneAllIcon}
              />

              <Grid size={12} >
                <Button
                  onClick={handleLogout}
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "#C5172E",
                    color: "white",
                    height: "35px",
                    textTransform: "none",
                    width: "100%",
                    "&:hover": { backgroundColor: "#8E1616" },
                  }}
                >
                  Logout
                </Button>
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
      <Grid size={8}>
        <Link href="/">
          <Typography sx={{ fontSize: "36px", fontWeight: "bold" }}>
            CineSwipe
          </Typography>
        </Link>
      </Grid>
      <Grid size={2}>
        <Button
          sx={{ width: "100%" }}
          onClick={() => router.push("/auth/signin")}
        >
          Login
        </Button>
      </Grid>
      <Grid size={2}>
        <Button
          sx={{ width: "100%" }}
          onClick={() => router.push("/auth/register")}
        >
          Register
        </Button>
      </Grid>
    </Grid>
  );
}
