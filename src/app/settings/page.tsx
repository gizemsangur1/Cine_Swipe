"use client";

import { useUserStore } from "@/store/useUserStore";
import {
  Col,
  Row,
  Typography,
  Button,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { account, databases, storage } from "@/lib/appwrite";
import { ID } from "appwrite";

type ProfileFormValues = {
  name: string;
  surname: string;
  username: string;
};

export default function Settings() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

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

        form.setFieldsValue({
          name: userDoc.name,
          surname: userDoc.surname,
          username: userDoc.username,
        });
      } catch (err: any) {
        console.error("Failed to fetch user", err.message);
      }
    };

    fetchUser();
  }, [form, setUser]);

  const onFinish = async (values: ProfileFormValues) => {
    const { name, surname, username } = values;

    if (!user?.id) {
      message.error("User not found");
      return;
    }

    let avatarUrl = user?.avatar_url || "";

    if (selectedAvatar) {
      try {
        const fileRes = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
          ID.unique(),
          selectedAvatar
        );

        avatarUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
          fileRes.$id
        );
      } catch (err: any) {
        console.error("Avatar upload failed:", err.message);
        message.error("Avatar upload failed");
        return;
      }
    }

    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.id,
        { name, surname, username, avatar_url: avatarUrl }
      );

      message.success("Profile updated successfully!");
      setUser({
        ...user,
        name,
        surname,
        username,
        avatar_url: avatarUrl,
      });

      setSelectedAvatar(null);
      setPreviewUrl(null);
    } catch (err: any) {
      message.error("Failed to update profile: " + err.message);
    }
  };

  const handleBeforeUpload = (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setSelectedAvatar(file);
    return false;
  };

  return (
    <Row style={{ width: "100%", padding: "15px" }} gutter={32}>
      <Col span={8}>
        <Typography.Title level={3}>Profile</Typography.Title>
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "#ddd",
            borderRadius: "50%",
            backgroundImage: previewUrl
              ? `url(${previewUrl})`
              : user?.avatar_url
              ? `url(${user.avatar_url})`
              : "none",
            backgroundSize: "cover",
          }}
        ></div>
        <Upload showUploadList={false} beforeUpload={handleBeforeUpload}>
          <Button icon={<UploadOutlined />} style={{ marginTop: "15px" }}>
            Upload New Avatar
          </Button>
        </Upload>
      </Col>

      <Col span={12}>
        <Typography.Title level={3}>Edit Profile</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Surname" name="surname">
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
