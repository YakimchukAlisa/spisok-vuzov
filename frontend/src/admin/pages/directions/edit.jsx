import { Form, Input, Button, message, Spin, Typography, Space, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const API = "http://localhost:8080/api";

export function DirectionEdit() {
  const { id, facultyId, directionId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [spheres, setSpheres] = useState([]);
  const [professions, setProfessions] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/napravleniya/${directionId}`),
      fetch(`${API}/spheres`),
      fetch(`${API}/professions`),
    ])
      .then(([dRes, sRes, pRes]) => Promise.all([dRes.json(), sRes.json(), pRes.json()]))
      .then(([direction, spheresData, profData]) => {
        setSpheres(Array.isArray(spheresData) ? spheresData : []);
        setProfessions(Array.isArray(profData) ? profData : []);
        if (direction) {
          form.setFieldsValue({
            kod: direction.kod,
            name: direction.name,
            opisanie: direction.opisanie,
            sphereIds: direction.sphereIds || [],
            professionIds: direction.professionIds || [],
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoading(false));
  }, [directionId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/napravleniya/${directionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Статус ${res.status}`);

      message.success("Направление обновлено!");
      navigate(`/admin/universities/${id}/faculties/${facultyId}/directions`);
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
          <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions`} style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать направление</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Код направления" name="kod" rules={[{ required: true, message: "Введите код" }]}>
          <Input placeholder="09.03.04" />
        </Form.Item>

        <Form.Item label="Наименование" name="name" rules={[{ required: true, message: "Введите наименование" }]}>
          <Input />
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
          <Input.TextArea rows={5} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Сохранить
        </Button>
      </Form>
    </div>
  );
}
