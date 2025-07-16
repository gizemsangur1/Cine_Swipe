"use client";

import { Form, Input, Button, message } from "antd";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    const { email, password } = values;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      message.error("Login failed: " + error.message);
    } else {
      message.success("Welcome back!");
      useUserStore.getState().setUser(data.user);
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      
      router.push("/");
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
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
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
