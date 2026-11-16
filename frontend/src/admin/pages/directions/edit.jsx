import { Form, Input, Button, message, Spin, Typography, Space, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function DirectionEdit() {
  const { id, facultyId, directionId } = useParams();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level") || "bachelor"; 

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [university, setUniversity] = useState(null);
  const [spheres, setSpheres] = useState([]); // <-- Храним сферы

  useEffect(() => {
    // Загружаем всё параллельно
    Promise.all([
      fetch(`http://localhost:3001/universities/${id}`).then(res => res.json()),
      fetch(`http://localhost:3001/spheres`).then(res => res.json())
    ]).then(([uniData, spheresData]) => {
      const uni = Array.isArray(uniData) ? uniData[0] : uniData;
      setUniversity(uni);
      setSpheres(Array.isArray(spheresData) ? spheresData : []);
      
      const faculty = uni.faculties?.find(f => String(f.id) === String(facultyId));
      const direction = faculty?.[level]?.directionsList?.find(d => String(d.id) === String(directionId));
      
      if (direction) {
        form.setFieldsValue({
          code: direction.code,
          code_name: direction.code_name || direction.name,
          description: direction.description,
          spheres: direction.spheres || [] // <-- Заполняем сферы
        }); 
      }
    }).catch(err => console.error(err))
      .finally(() => setInitialLoading(false));
  }, [id, facultyId, directionId, level, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const faculty = university.faculties.find(f => String(f.id) === String(facultyId));
      
      const updatedDirections = faculty[level].directionsList.map(d => 
        String(d.id) === String(directionId) 
          ? { ...d, ...values } 
          : d
      );

      const updatedFaculty = {
        ...faculty,
        [level]: { ...faculty[level], directionsList: updatedDirections }
      };

      const updatedFaculties = university.faculties.map(f => 
        String(f.id) === String(facultyId) ? updatedFaculty : f
      );

      await fetch(`http://localhost:3001/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...university, faculties: updatedFaculties }),
      });

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
        <Form.Item label="Код направления" name="code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item label="Наименование" name="code_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* 👇 ПОЛЕ ДЛЯ ВЫБОРА СФЕР (БЕЗ РЕЖИМА TAGS) */}
        <Form.Item label="Сферы" name="spheres">
          <Select 
            mode="multiple" 
            placeholder="Выберите сферы" 
            options={spheres.map(s => ({ label: s.name, value: s.code }))} 
          />
        </Form.Item>
        
        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={5} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Сохранить
        </Button>
      </Form>
    </div>
  );
}