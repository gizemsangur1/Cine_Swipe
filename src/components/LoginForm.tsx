"use client";

import { Form, Input, Button, message } from "antd";
import { account, databases } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { Models } from "appwrite";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const ensureUserDoc = async (authUser: Models.User<Models.Preferences>) => {
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
    } catch (err) {
      const error = err as { code?: number; message?: string };
      if (error.code !== 409) {
        console.error("Failed to create user doc:", error.message);
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

      setUser({
        id: userDoc.$id,
        email: authUser.email,
        name: (userDoc as any).name || "",
        surname: (userDoc as any).surname || "",
        username: (userDoc as any).username || "",
        avatar_url: (userDoc as any).avatar_url || "",
      });

      message.success("Login successful!");
      router.push("/");
    } catch (err) {
      const error = err as { code?: number; message?: string };
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
