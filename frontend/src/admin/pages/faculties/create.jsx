import { Create } from "@refinedev/antd";
import { Form, Input, Button, message, Upload, Typography, Space } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function FacultyCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [university, setUniversity] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetch(`http://localhost:8080/api/vuz/admin-list/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const uni = Array.isArray(data) ? data[0] : data;
        setUniversity(uni);
      })
      .catch((err) => console.error("Ошибка загрузки вуза:", err));
  }, [id]);

  // Параметр form убран: внутри доступен form из Form.useForm,
  // а второй аргумент beforeUpload — это список файлов, не форма
  const handleUpload = (file) => {
    let folderName = "";

    // 1. Пытаемся взять папку из пути картинки текущего вуза
    if (university?.imageUrl) {
      const parts = university.imageUrl.split('/');
      if (parts.length >= 3 && parts[1] === 'img') {
        folderName = parts[2];
        // Убираем расширение файла, если оно там есть (например, "spbpu.jpg" -> "spbpu")
        folderName = folderName.split('.')[0];
      }
    }

    // 2. Если папка не определилась, берем имя файла (без расширения)
    if (!folderName) {
      folderName = file.name.split('.')[0].toLowerCase();
    }

    // 3. Формируем правильный путь: /img/spbpu/spbpu.svg
    const path = `/img/${folderName}/${file.name}`;

    form.setFieldsValue({ logoUrl: path });
    message.success(`Путь сохранен: ${path}`);
    return false;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/vuz/${id}/fakultety`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Статус ${res.status}`);

      message.success("Факультет добавлен!");
      navigate(`/admin/universities/${id}/faculties`);
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
          <Link to={`/admin/universities/${id}/faculties`} style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Добавить факультет</Title>
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
