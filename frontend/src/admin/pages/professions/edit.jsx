import { Form, Input, Button, message, Spin, Typography, Space, Select, Divider, InputNumber } from "antd";
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;
const API = "http://localhost:8080/api";

export function ProfessionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [spheres, setSpheres] = useState([]);
  const [directions, setDirections] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [qualityOptions, setQualityOptions] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/professions/${id}`),
      fetch(`${API}/spheres`),
      fetch(`${API}/napravleniya/all`),
      fetch(`${API}/professions`),
    ])
      .then(([profRes, sphRes, dirRes, allRes]) =>
        Promise.all([profRes.json(), sphRes.json(), dirRes.json(), allRes.json()])
      )
      .then(([profData, spheresData, dirData, allData]) => {
        const profession = Array.isArray(profData) ? profData[0] : profData;
        setSpheres(Array.isArray(spheresData) ? spheresData : []);
        setDirections(Array.isArray(dirData) ? dirData : []);

        const skillSet = new Set();
        const qualitySet = new Set();
        (Array.isArray(allData) ? allData : []).forEach((p) => {
          (p.skills || []).forEach((s) => skillSet.add(s));
          (p.suitableFor || []).forEach((q) => qualitySet.add(q));
        });
        setSkillOptions([...skillSet].map((s) => ({ label: s, value: s })));
        setQualityOptions([...qualitySet].map((q) => ({ label: q, value: q })));

        if (profession) {
          form.setFieldsValue({
            name: profession.name,
            description: profession.description,
            sphereIds: profession.sphereIds || [],
            directionIds: profession.directionIds || [],
            skills: profession.skills || [],
            suitableForText: profession.suitableForText,
            suitableFor: profession.suitableFor || [],
            salaryLevels: (profession.salaryLevels || []).map((s) => ({
              level: s.level,
              start: s.start,
              end: s.end,
            })),
          });
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Ошибка загрузки данных");
      })
      .finally(() => setInitialLoading(false));
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/professions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          description: values.description || null,
          sphereIds: values.sphereIds || [],
          directionIds: values.directionIds || [],
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
        <Form.Item label="Наименование профессии" name="name" rules={[{ required: true, message: "Введите название" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <TextArea rows={3} />
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
          <TextArea rows={2} />
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
