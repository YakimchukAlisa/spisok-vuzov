import { Form, Input, Button, message, Typography, Space, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function DirectionCreate() {
  const { id, facultyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spheres, setSpheres] = useState([]); // <-- Храним сферы
  const [form] = Form.useForm();

  // Загружаем список сфер при открытии страницы
  useEffect(() => {
    fetch(`http://localhost:3001/spheres`)
      .then(res => res.json())
      .then(data => setSpheres(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/universities/${id}`);
      const data = await res.json();
      const university = Array.isArray(data) ? data[0] : data;
      
      const faculty = university.faculties.find(f => String(f.id) === String(facultyId));

      const newDirection = {
        id: Date.now(),
        code: values.code,
        code_name: values.code_name,
        description: values.description,
        spheres: values.spheres || [], // <-- Сохраняем массив выбранных кодов сфер
        profiles: [] 
      };

      const updatedFaculty = {
        ...faculty,
        bachelor: {
          ...faculty.bachelor,
          directionsList: [...(faculty.bachelor?.directionsList || []), newDirection]
        }
      };

      const updatedFaculties = university.faculties.map(f => 
        String(f.id) === String(facultyId) ? updatedFaculty : f
      );

      await fetch(`http://localhost:3001/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...university, faculties: updatedFaculties }),
      });

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
        <Form.Item label="Код направления" name="code" rules={[{ required: true, message: "Введите код" }]}>
          <Input placeholder="09.03.04" />
        </Form.Item>
        
        <Form.Item label="Наименование" name="code_name" rules={[{ required: true, message: "Введите наименование" }]}>
          <Input placeholder="Программная инженерия" />
        </Form.Item>

        <Form.Item label="Сферы" name="spheres">
          <Select 
            mode="multiple" // <-- Позволяет выбрать несколько, но не писать свои
            placeholder="Выберите сферы" 
            options={spheres.map(s => ({ label: s.name, value: s.code }))} 
          />
        </Form.Item>
        
        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={5} placeholder="Введите описание направления..." />
        </Form.Item>
        
        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Сохранить
        </Button>
      </Form>
    </div>
  );
}