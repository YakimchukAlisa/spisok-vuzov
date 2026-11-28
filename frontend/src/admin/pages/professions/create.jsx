import { Form, Input, Button, message, Typography, Space, Select, Divider, InputNumber } from "antd";
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;
const API = "http://localhost:8080/api";

export function ProfessionCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spheres, setSpheres] = useState([]);
  const [directions, setDirections] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [qualityOptions, setQualityOptions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/spheres`),
      fetch(`${API}/napravleniya/all`),
      fetch(`${API}/professions`),
    ])
      .then(([sRes, dRes, pRes]) => Promise.all([sRes.json(), dRes.json(), pRes.json()]))
      .then(([sData, dData, pData]) => {
        setSpheres(Array.isArray(sData) ? sData : []);
        setDirections(Array.isArray(dData) ? dData : []);

        // Подсказки для навыков и качеств — из уже сохранённых профессий
        const profs = Array.isArray(pData) ? pData : [];
        const skillSet = new Set();
        const qualitySet = new Set();
        profs.forEach((p) => {
          (p.skills || []).forEach((s) => skillSet.add(s));
          (p.suitableFor || []).forEach((q) => qualitySet.add(q));
        });
        setSkillOptions([...skillSet].map((s) => ({ label: s, value: s })));
        setQualityOptions([...qualitySet].map((q) => ({ label: q, value: q })));
      })
      .catch((err) => console.error("Ошибка загрузки данных:", err));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/professions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          description: values.description || null,
          sphereIds: values.sphereIds || [],
          skills: values.skills || [],
          suitableForText: values.suitableForText || null,
          suitableFor: values.suitableFor || [],
          salaryLevels: (values.salaryLevels || []).map((s) => ({
            level: s.level,
            start: s.start ?? null,
            end: s.end ?? null,
          })),
        }),
      });
      if (!response.ok) throw new Error(`Статус ${response.status}`);
      const created = await response.json();

      // Направления привязываем вторым запросом — ID появился только что
      if ((values.directionIds || []).length > 0) {
        const linkRes = await fetch(`${API}/professions/${created.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ directionIds: values.directionIds }),
        });
        if (!linkRes.ok) throw new Error(`Статус ${linkRes.status}`);
      }

      message.success("Профессия добавлена!");
      navigate("/admin/professions");
    } catch (error) {
      console.error(error);
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
        <Form.Item label="Наименование профессии" name="name" rules={[{ required: true, message: "Введите название" }]}>
          <Input placeholder="Например: Программист" />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <TextArea rows={3} placeholder="Краткое описание профессии..." />
        </Form.Item>

        <Form.Item label="Сферы" name="sphereIds">
          <Select
            mode="multiple"
            placeholder="Выберите сферы"
            options={spheres.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>

        <Form.Item label="Направления подготовки" name="directionIds">
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="label"
            placeholder="Выберите направления"
            options={directions.map((d) => ({
              label: d.kod ? `${d.kod} — ${d.name}` : d.name,
              value: d.id,
            }))}
          />
        </Form.Item>

        <Divider orientation="left">Что должен уметь</Divider>
        <Form.Item label="Навыки" name="skills" tooltip="Выберите из списка или введите свой и нажмите Enter">
          <Select mode="tags" placeholder="Python, SQL, Git..." options={skillOptions} />
        </Form.Item>

        <Divider orientation="left">Кому подходит</Divider>
        <Form.Item label="Вступительный текст" name="suitableForText">
          <TextArea rows={2} placeholder="Профессия подойдет людям, которые..." />
        </Form.Item>
        <Form.Item label="Качества" name="suitableFor" tooltip="Выберите из списка или введите своё и нажмите Enter">
          <Select mode="tags" placeholder="Усидчивость, логика..." options={qualityOptions} />
        </Form.Item>

        <Divider orientation="left">Зарплата</Divider>

        <Form.List name="salaryLevels">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item {...restField} name={[name, 'level']} rules={[{ required: true, message: 'Введите уровень' }]}>
                    <Input placeholder="Уровень (например: Начальный)" style={{ width: 220 }} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'start']} rules={[{ required: true, message: 'Введите сумму' }]}>
                    <InputNumber placeholder="От, руб." min={0} style={{ width: 140 }} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'end']}>
                    <InputNumber placeholder="До (необязательно)" min={0} style={{ width: 170 }} />
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
