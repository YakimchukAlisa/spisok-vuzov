import { Form, Input, Button, message, Spin, Typography, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
const API = "http://localhost:8080/api";
const TEST_ID = 1;
const { Title } = Typography;

export function TestQuestionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

   useEffect(() => {
     fetch(`${API}/test/questions/${id}`)
       .then((res) => res.json())
       .then((data) => {
         const item = Array.isArray(data) ? data[0] : data;
         if (item) form.setFieldsValue({ question: item.question });
       })
       .finally(() => setInitialLoading(false));
   }, [id, form]);

   const onFinish = async (values) => {
     setLoading(true);
     try {
       const res = await fetch(`${API}/test/questions/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ question: values.question }),
       });
       if (!res.ok) throw new Error(`Статус ${res.status}`);
       message.success("Вопрос обновлен!");
       navigate("/admin/test");
     } catch (error) {
       message.error("Ошибка");
     } finally {
       setLoading(false);
     }
   };

  if (initialLoading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <Space size="middle" align="center">
          <Link to="/admin/test" style={{ color: '#000', fontSize: '20px' }}><ArrowLeftOutlined /></Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать вопрос</Title>
        </Space>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Текст вопроса" name="question" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} size="large">Сохранить</Button>
      </Form>
    </div>
  );
}