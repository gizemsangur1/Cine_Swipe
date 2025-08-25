"use client";

import { useUserStore } from "@/store/useUserStore";
import { Col, Row, Button, Form, Input, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { account, databases, storage } from "@/lib/appwrite";
import { ID } from "appwrite";
import PageHeader from "@/components/Typography/PageHeader";
import SubmitButton from "@/components/Buttons/Submit/SubmitButton";

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
  const [loading, setLoading] = useState(false);

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
          name: (userDoc as Record<string, unknown>)?.name as string ?? "",
          surname: (userDoc as Record<string, unknown>)?.surname as string ?? "",
          username: (userDoc as Record<string, unknown>)?.username as string ?? "",
          avatar_url: (userDoc as Record<string, unknown>)?.avatar_url as string ?? "",
        });

        form.setFieldsValue({
          name: (userDoc as Record<string, unknown>)?.name as string ?? "",
          surname: (userDoc as Record<string, unknown>)?.surname as string ?? "",
          username: (userDoc as Record<string, unknown>)?.username as string ?? "",
        });
      } catch (err) {
        const error = err as Error;
        console.error("Failed to fetch user", error.message);
      }
    };

    fetchUser();
  }, [form, setUser]);

  const onFinish = async (values: ProfileFormValues) => {
    setLoading(true);
    const { name, surname, username } = values;

    if (!user?.id) {
      message.error("User not found");
      setLoading(false);
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
      } catch (err) {
        const error = err as Error;
        console.error("Avatar upload failed:", error.message);
        message.error("Avatar upload failed");
        setLoading(false);
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
    } catch (err) {
      const error = err as Error;
      message.error("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeUpload = (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setSelectedAvatar(file);
    return false;
  };

  return (
    <Row style={{ width: "100%", padding: "15px", marginTop: "65px" }} gutter={32}>
      <Col span={8} style={{ paddingLeft: "45px" }}>
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
            marginTop: "55px",
          }}
        ></div>
        <Upload showUploadList={false} beforeUpload={handleBeforeUpload}>
          <Button icon={<UploadOutlined />} style={{ marginTop: "15px" }}>
            Upload New Avatar
          </Button>
        </Upload>
      </Col>

      <Col span={12}>
        <PageHeader pageTitle="Edit Profile" />
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
            <SubmitButton title="Save Changes" type="submit" loading={loading} />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
