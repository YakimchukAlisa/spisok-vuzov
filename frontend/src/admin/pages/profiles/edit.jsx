import { Form, Input, Button, message, Spin, Typography, Space, InputNumber, Divider, Checkbox, Select, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const API = "http://localhost:8080/api";

export function ProfileEdit() {
  const { id, facultyId, directionId, profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [direction, setDirection] = useState(null);
  const [forms, setForms] = useState([]);
  const [levels, setLevels] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [university, setUniversity] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [formySdachi, setFormySdachi] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/profil/${profileId}/admin-edit`),
      fetch(`${API}/napravleniya/${directionId}`),
      fetch(`${API}/form-obuch`),
      fetch(`${API}/ur-obraz`),
      fetch(`${API}/exams/ege`),
      fetch(`${API}/vuz/admin-list/${id}`),
      fetch(`${API}/exams/formy-sdachi`),
    ])
      .then(([p, d, f, u, e, v, fs]) => Promise.all([p.json(), d.json(), f.json(), u.json(), e.json(), v.json(), fs.json()]))
      .then(([prof, dir, formsData, levelsData, examsData, uni, fsData]) => {
        setDirection(dir);
        setForms(Array.isArray(formsData) ? formsData : []);
        setLevels(Array.isArray(levelsData) ? levelsData : []);
        setExamOptions((Array.isArray(examsData) ? examsData : []).map((s) => ({ label: s, value: s })));
        setUniversity(uni);
        setFormySdachi(Array.isArray(fsData) ? fsData : []);

        if (prof) {
          const budget = prof.budget || {};
          const paid = prof.paid || {};
          form.setFieldsValue({
            name: prof.name,
            srokObuchMes: prof.srokObuchMes,
            formId: prof.formId,
            urId: prof.urId,
            exams: prof.exams || [],
            budgetPlaces: budget.places ?? 0,
            budgetScore: budget.score ?? 0,
            paidPlaces: paid.places ?? 0,
            paidScore: paid.score ?? 0,
            paidPrice: paid.price ?? 0,
            files: prof.files || [],
          });

          const existingFiles = (prof.files || []).map((f2, index) => ({
            uid: `existing-${index}`,
            name: f2.url || f2.name,
            url: f2.url,
            status: "done",
          }));
          setFileList(existingFiles);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoading(false));
  }, [id, directionId, profileId, form]);

  const handleNameMatch = (e) => {
    form.setFieldsValue({ name: e.target.checked && direction ? direction.name : "" });
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    const updatedList = newFileList.map((file) => {
      if (!file.url) {
        let folderName = "";
        if (university?.imageUrl) {
          const parts = university.imageUrl.split('/');
          if (parts.length >= 3) folderName = parts[2].split('.')[0];
        }
        if (!folderName) folderName = "vuz";
        const path = `/img/${folderName}/${file.name}`;
        return { ...file, name: path, url: path };
      }
      return file;
    });

    setFileList(updatedList);
    form.setFieldsValue({ files: updatedList.map((f) => ({ name: f.name, url: f.url })) });
  };

  const formaOptions = formySdachi.map((f) => ({ label: f, value: f }));

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/profil/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          srokObuchMes: values.srokObuchMes,
          formId: values.formId,
          urId: values.urId,
          exams: values.exams || [],
          files: values.files || [],
          budget: { places: values.budgetPlaces || 0, score: values.budgetScore || 0 },
          paid: { places: values.paidPlaces || 0, score: values.paidScore || 0, price: values.paidPrice || 0 },
        }),
      });
      if (!res.ok) throw new Error(`Статус ${res.status}`);

      message.success("Профиль обновлен!");
      navigate(`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles`);
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
          <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles`} style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать профиль</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Название профиля" required style={{ marginBottom: 0 }}>
          <Space align="start" style={{ display: 'flex', marginBottom: 8 }}>
            <Form.Item name="name" rules={[{ required: true, message: "Введите название" }]} noStyle>
              <Input style={{ width: 400 }} />
            </Form.Item>
            <Checkbox onChange={handleNameMatch}>Совпадает с названием направления</Checkbox>
          </Space>
        </Form.Item>

        <Form.Item label="Срок обучения (месяцев)" name="srokObuchMes" rules={[{ required: true, message: "Введите срок" }]}>
          <InputNumber min={1} max={72} style={{ width: 160 }} />
        </Form.Item>

        <Space style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Form.Item label="Форма обучения" name="formId" rules={[{ required: true, message: "Выберите форму" }]}>
            <Select placeholder="Выберите форму" style={{ width: 200 }} options={forms.map((f) => ({ label: f.name, value: f.id }))} />
          </Form.Item>
          <Form.Item label="Уровень образования" name="urId" rules={[{ required: true, message: "Выберите уровень" }]}>
            <Select placeholder="Выберите уровень" style={{ width: 220 }} options={levels.map((l) => ({ label: l.name, value: l.id }))} />
          </Form.Item>
        </Space>

        <Divider orientation="left">Экзамены</Divider>
        <Form.List name="exams">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', gap: 12 }} align="baseline" wrap>
                  <Form.Item
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Выберите предмет" }]}
                    {...restField}
                  >
                    <Select showSearch placeholder="Предмет" style={{ width: 220 }} options={examOptions} />
                  </Form.Item>
                  <Form.Item name={[name, "formaSdachi"]}>
                    <Select style={{ width: 200 }} options={formaOptions} />
                  </Form.Item>
                  <Form.Item name={[name, "minBall"]}>
                    <InputNumber min={0} max={100} placeholder="Мин. балл" style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item name={[name, "priority"]}>
                    <InputNumber min={1} placeholder="Приоритет" style={{ width: 110 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const current = form.getFieldValue("exams") || [];
                    add({ formaSdachi: "ЕГЭ", priority: current.length + 1 });
                  }}
                >
                  Добавить предмет
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Бюджет</Divider>
        <Space style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Form.Item label="Мест" name="budgetPlaces"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Проходной балл" name="budgetScore"><InputNumber min={0} max={400} /></Form.Item>
        </Space>

        <Divider orientation="left">Платно</Divider>
        <Space style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Form.Item label="Мест" name="paidPlaces"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Проходной балл" name="paidScore"><InputNumber min={0} max={400} /></Form.Item>
          <Form.Item label="Цена за год, руб." name="paidPrice"><InputNumber min={0} step={1000} /></Form.Item>
        </Space>

        <Divider orientation="left">Документы</Divider>
        <Form.Item label="Загрузить документы (учебный план и т.д.)">
          <Upload fileList={fileList} onChange={handleUploadChange} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
          </Upload>
          <Form.Item name="files" noStyle />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ marginTop: 16 }}>
          Сохранить
        </Button>
      </Form>
    </div>
  );
}
