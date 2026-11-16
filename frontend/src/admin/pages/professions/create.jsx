import { Form, Input, Button, message, Typography, Space, Select, Divider } from "antd";
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;

export function ProfessionCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spheres, setSpheres] = useState([]);
  const [form] = Form.useForm();

  // Загружаем сферы для выпадающего списка
  useEffect(() => {
    fetch(`http://localhost:3001/spheres`)
      .then(res => res.json())
      .then(data => setSpheres(Array.isArray(data) ? data : []));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/professions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: Date.now() }),
      });
      message.success("Профессия добавлена!");
      navigate("/admin/professions");
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
          <Link to="/admin/professions" style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Добавить профессию</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* --- ОСНОВНАЯ ИНФОРМАЦИЯ --- */}
        <Form.Item label="Наименование профессии" name="name" rules={[{ required: true, message: "Введите название" }]}>
          <Input placeholder="Например: Программист" />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <TextArea rows={3} placeholder="Краткое описание профессии..." />
        </Form.Item>

        <Form.Item label="Сферы" name="spheres">
          <Select 
            mode="multiple" 
            placeholder="Выберите сферы" 
            options={spheres.map(s => ({ label: s.name, value: s.code }))} 
          />
        </Form.Item>

        {/* --- НАВЫКИ --- */}
        <Divider orientation="left">Что должен уметь</Divider>
        <Form.Item label="Навыки" name="skills" tooltip="Введите навык и нажмите Enter">
          <Select mode="tags" placeholder="Python, SQL, Git..." />
        </Form.Item>

        {/* --- КОМУ ПОДХОДИТ --- */}
        <Divider orientation="left">Кому подходит</Divider>
        <Form.Item label="Вступительный текст" name="suitableForText">
          <TextArea rows={2} placeholder="Профессия подойдет людям, которые..." />
        </Form.Item>
        <Form.Item label="Качества" name="suitableFor">
          <Select mode="tags" placeholder="Усидчивость, логика..." />
        </Form.Item>

        {/* --- ЗАРПЛАТА --- */}
        <Divider orientation="left">Зарплата</Divider>
        <Form.Item label="Вступительный текст" name="salaryText">
          <TextArea rows={2} placeholder="Зарплата может зависеть от..." />
        </Form.Item>

        {/* Динамический список зарплат */}
        <Form.List name="salaryLevels">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'level']}
                    rules={[{ required: true, message: 'Введите уровень' }]}
                  >
                    <Input placeholder="Уровень (например: Начальный)" style={{ width: '300px' }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'amount']}
                    rules={[{ required: true, message: 'Введите сумму' }]}
                  >
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