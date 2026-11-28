import { Form, Input, Button, message, Typography, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
const API = "http://localhost:8080/api";
const TEST_ID = 1;

const { Title } = Typography;

export function TestQuestionCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await fetch(`${API}/test/${TEST_ID}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: values.question }),
      });
      message.success("Вопрос добавлен!");
      navigate("/admin/test");
    } catch (error) {
      message.error("Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <Space size="middle" align="center">
          <Link to="/admin/test" style={{ color: '#000', fontSize: '20px' }}><ArrowLeftOutlined /></Link>
          <Title level={3} style={{ margin: 0 }}>Добавить вопрос</Title>
        </Space>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Текст вопроса" name="question" rules={[{ required: true, message: "Введите вопрос" }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} size="large">Сохранить</Button>
      </Form>
    </div>
  );
}