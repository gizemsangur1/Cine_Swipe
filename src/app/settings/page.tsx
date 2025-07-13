"use client";

import { supabase } from "@/lib/supabaseClient";
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

export default function Settings() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
        });

        form.setFieldsValue({
          name: data.user.user_metadata?.name,
          surname: data.user.user_metadata?.surname,
          username: data.user.user_metadata?.username,
        });
      }
    };

    fetchUser();
  }, [form, setUser]);

const onFinish = async (values: any) => {
  const { name, surname, username } = values;

  let avatarUrl = user?.avatar_url;

  if (selectedAvatar && user?.id) {
    const fileExt = selectedAvatar.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    await supabase.storage.from("avatars").remove([fileName]);

    const { data: uploaded, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, selectedAvatar, {
        upsert: true,
        cacheControl: "3600",
        contentType: selectedAvatar.type || "image/jpeg",
      });

    if (uploadError) {
      message.error("Avatar upload failed: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      name,
      surname,
      username,
      avatar_url: avatarUrl,
    },
  });

  if (error) {
    message.error("Failed to update profile: " + error.message);
  } else {
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
