"use client";

import { Form, Input, Button, message } from "antd";
import { account, databases } from "@/lib/appwrite"; 
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

type RegisterFormValues = {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const onFinish = async (values: RegisterFormValues) => {
    const { name, surname, username, email, password } = values;

    try {
      const user = await account.create(ID.unique(), email, password, `${name} ${surname}`);
      await account.createEmailPasswordSession(email, password);

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.$id,
        { email, name, surname, username, avatar_url: "" }
      );

      const userDoc = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.$id
      );

      setUser({
        id: userDoc.$id,
        email,
        name,
        surname,
        username,
        avatar_url: "",
      });

      message.success("Account created & logged in!");
      router.push("/");
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.code === 409) {
        message.error("This email is already registered.");
      } else {
        message.error(error.message || "Registration failed.");
      }
    }
  };

  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={onFinish}
      style={{ width: 300, margin: "60px auto" }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Surname" name="surname" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Username" name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
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
        rules={[{ required: true, min: 6 }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
