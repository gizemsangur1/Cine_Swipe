"use client";

import { Form, Input, Button, message } from "antd";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    const { name, surname, username, email, password } = values;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          surname,
          username,
        },
      },
    });

    if (error) {
      message.error(error.message);
    } else {
      message.success("Account created. Please check your email.");
      router.push("/auth/signin");
    }
  };

  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={onFinish}
      style={{ width: 300, margin: "60px auto" }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input type="name" />
      </Form.Item>
      <Form.Item
        label="Surname"
        name="surname"
        rules={[{ required: true, message: "Please input your surname!" }]}
      >
        <Input type="surname" />
      </Form.Item>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input type="username" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 6, message: "Password must be at least 6 characters." },
        ]}
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
