import { Form, Input, Button, message, Spin, Upload, Typography, Space } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function FacultyEdit() {
  const { id, facultyId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/fakultet/${facultyId}`),
      fetch(`http://localhost:8080/api/vuz/admin-list/${id}`),
    ])
      .then(([fRes, uRes]) => Promise.all([fRes.json(), uRes.json()]))
      .then(([faculty, uni]) => {
        setUniversity(uni);
        if (faculty) {
          form.setFieldsValue(faculty);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoading(false));
  }, [id, facultyId, form]);

  const handleUpload = (file) => {
    let folderName = "";

    if (university?.imageUrl) {
      const parts = university.imageUrl.split('/');
      if (parts.length >= 3 && parts[1] === 'img') {
        folderName = parts[2];
        folderName = folderName.split('.')[0];
      }
    }

    if (!folderName) {
      folderName = file.name.split('.')[0].toLowerCase();
    }

    const path = `/img/${folderName}/${file.name}`;

    form.setFieldsValue({ logoUrl: path });
    message.success(`Путь сохранен: ${path}`);
    return false;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/fakultet/${facultyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Статус ${res.status}`);

      message.success("Факультет обновлен!");
      navigate(`/admin/universities/${id}/faculties`);
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
          <Link to={`/admin/universities/${id}/faculties`} style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать факультет</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Полное наименование" name="name" rules={[{ required: true, message: "Введите название" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Аббревиатура" name="shortName" rules={[{ required: true, message: "Введите аббревиатуру" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Логотип факультета">
          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Выбрать логотип</Button>
          </Upload>
          <Form.Item name="logoUrl" noStyle>
            <Input placeholder="/img/altgtu/fit.svg" readOnly style={{ marginTop: 8 }} />
          </Form.Item>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Сохранить
        </Button>
      </Form>
    </div>
  );
}
