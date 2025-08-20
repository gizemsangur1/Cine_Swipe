"use client";

import { Form, Input, Button, message } from "antd";
import { account, databases } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const ensureUserDoc = async (authUser: any) => {
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        authUser.$id,
        {
          email: authUser.email,
          name: authUser.name || "",
          surname: "",
          username: "",
          avatar_url: "",
        }
      );
    } catch (err: any) {
      if (err.code !== 409) {
        console.error("Failed to create user doc:", err.message);
      }
    }
  };

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await account.createEmailPasswordSession(values.email, values.password);

      const authUser = await account.get();
      await ensureUserDoc(authUser);

      const userDoc = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        authUser.$id
      );

      // 🔥 Store'a yaz
      setUser({
        id: userDoc.$id,
        email: authUser.email,
        name: userDoc.name || "",
        surname: userDoc.surname || "",
        username: userDoc.username || "",
        avatar_url: userDoc.avatar_url || "",
      });

      message.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 401) {
        message.error("Invalid email or password.");
      } else if (error.code === 429) {
        message.error("Too many attempts, please wait a moment.");
      } else {
        message.error(error.message || "Login failed.");
      }
    }
  };

  return (
    <Form
      name="login"
      layout="vertical"
      onFinish={onFinish}
      style={{ width: 300, margin: "60px auto" }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
