import { Form, Input, Button, message, Spin, Typography, Space, Select, Divider } from "antd";
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;

export function ProfessionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [spheres, setSpheres] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/professions/${id}`).then(res => res.json()),
      fetch(`http://localhost:3001/spheres`).then(res => res.json())
    ]).then(([profData, spheresData]) => {
      const profession = Array.isArray(profData) ? profData[0] : profData;
      setSpheres(Array.isArray(spheresData) ? spheresData : []);
      
      if (profession) {
        form.setFieldsValue({
          name: profession.name,
          description: profession.description,
          spheres: profession.spheres || [],
          skills: profession.skills || [],
          suitableForText: profession.suitableForText,
          suitableFor: profession.suitableFor || [],
          salaryText: profession.salaryText,
          salaryLevels: profession.salaryLevels || []
        });
      }
    }).catch(err => {
      console.error(err);
      message.error("Ошибка загрузки данных");
    }).finally(() => setInitialLoading(false));
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/professions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: Number(id) }),
      });
      message.success("Профессия обновлена!");
      navigate("/admin/professions");
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
          <Link to="/admin/professions" style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать профессию</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Наименование профессии" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Описание" name="description">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Сферы" name="spheres">
          <Select mode="multiple" options={spheres.map(s => ({ label: s.name, value: s.code }))} />
        </Form.Item>

        <Divider orientation="left">Что должен уметь</Divider>
        <Form.Item label="Навыки" name="skills">
          <Select mode="tags" />
        </Form.Item>

        <Divider orientation="left">Кому подходит</Divider>
        <Form.Item label="Вступительный текст" name="suitableForText">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Качества" name="suitableFor">
          <Select mode="tags" />
        </Form.Item>

        <Divider orientation="left">Зарплата</Divider>
        <Form.Item label="Вступительный текст" name="salaryText">
          <TextArea rows={2} />
        </Form.Item>

        <Form.List name="salaryLevels">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item {...restField} name={[name, 'level']} rules={[{ required: true }]}>
                    <Input placeholder="Уровень (например: Начальный)" style={{ width: '300px' }} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'amount']} rules={[{ required: true }]}>
                    <Input placeholder="Сумма (например: От 40 000 руб.)" style={{ width: '300px' }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Добавить уровень зарплаты
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ marginTop: 16 }}>
          Сохранить
        </Button>
      </Form>
    </div>
  );
}