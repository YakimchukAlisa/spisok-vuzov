import { Form, Input, Button, message, Typography, Space, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const API = "http://localhost:8080/api";

export function DirectionCreate() {
  const { id, facultyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spheres, setSpheres] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/spheres`),
      fetch(`${API}/professions`),
    ])
      .then(([sRes, pRes]) => Promise.all([sRes.json(), pRes.json()]))
      .then(([spheresData, profData]) => {
        setSpheres(Array.isArray(spheresData) ? spheresData : []);
        setProfessions(Array.isArray(profData) ? profData : []);
      })
      .catch((err) => console.error(err));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/fakultet/${facultyId}/napravleniya`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Статус ${res.status}`);

      message.success("Направление добавлено!");
      navigate(`/admin/universities/${id}/faculties/${facultyId}/directions`);
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
          <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions`} style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Добавить направление</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Код направления" name="kod" rules={[{ required: true, message: "Введите код" }]}>
          <Input placeholder="09.03.04" />
        </Form.Item>

        <Form.Item label="Наименование" name="name" rules={[{ required: true, message: "Введите наименование" }]}>
          <Input placeholder="Программная инженерия" />
        </Form.Item>

        <Form.Item label="Сферы" name="sphereIds">
          <Select
            mode="multiple"
            placeholder="Выберите сферы"
            options={spheres.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>

        <Form.Item label="Профессии" name="professionIds">
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="label"
            placeholder="Выберите профессии"
            options={professions.map((p) => ({ label: p.name, value: p.id }))}
          />
        </Form.Item>

        <Form.Item label="Описание" name="opisanie">
          <Input.TextArea rows={5} placeholder="Введите описание направления..." />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Сохранить
        </Button>
      </Form>
    </div>
  );
}
