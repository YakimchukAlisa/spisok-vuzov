import { Form, Input, Upload, Button, message, Spin, Typography, Space } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function SphereEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/spheres/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const sphere = Array.isArray(data) ? data[0] : data;
        if (sphere) {
          form.setFieldsValue({
            name: sphere.name,
            imageUrl: sphere.imageUrl
          });
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Ошибка загрузки сферы");
      })
      .finally(() => setInitialLoading(false));
  }, [id, form]);

  const handleUpload = (file) => {
    const path = `/sphere/${file.name}`;
    form.setFieldsValue({ imageUrl: path });
    message.success(`Путь сохранен: ${path}`);
    return false;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/spheres/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: Number(id) }),
      });

      message.success("Сфера обновлена!");
      navigate("/admin/spheres");
    } catch (error) {
      message.error("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <Space size="middle" align="center">
          <Link to="/admin/spheres" style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать сферу</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Наименование сферы" name="name" rules={[{ required: true }]}>
          <Input />
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