import { Form, Input, Upload, Button, message, Typography, Space } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

export function SphereCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpload = (file) => {
    const path = `/sphere/${file.name}`;
    form.setFieldsValue({ imageUrl: path });
    message.success(`Путь сохранен: ${path}`);
    return false;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/spheres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: Date.now() }), // Генерируем ID
      });

      message.success("Сфера добавлена!");
      navigate("/admin/spheres");
    } catch (error) {
      message.error("Ошибка при добавлении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <Space size="middle" align="center">
          <Link to="/admin/spheres" style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Добавить сферу</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Наименование сферы" name="name" rules={[{ required: true }]}>
          <Input placeholder="Например: Информационные технологии" />
        </Form.Item>

        <Form.Item label="Иконка (SVG)">
          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Выбрать иконку</Button>
          </Upload>
          <Form.Item name="imageUrl" noStyle>
            <Input placeholder="/sphere/it.svg" readOnly style={{ marginTop: 8 }} />
          </Form.Item>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Сохранить
        </Button>
      </Form>
    </div>
  );
}