import { List } from "@refinedev/antd";
import { Table, Typography, Spin, message, Button } from "antd";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function FacultyList() {
  const { id } = useParams(); // ID вуза
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUniversity = () => {
    setLoading(true);
    fetch(`http://localhost:3001/universities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const item = Array.isArray(data) ? data[0] : data;
        setUniversity(item);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот факультет?")) return;
    
    try {
      const updatedFaculties = university.faculties.filter(f => f.id !== facultyId);
      
      await fetch(`http://localhost:3001/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...university, faculties: updatedFaculties }),
      });

      message.success("Факультет удален");
      fetchUniversity();
    } catch (err) {
      message.error("Ошибка удаления");
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;
  if (!university) return <div>Вуз не найден</div>;

  return (
    <List
      title={`Факультеты: ${university.name}`}
      headerButtons={
        <Link to={`/admin/universities/${id}/faculties/create`}>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить факультет
          </Button>
        </Link>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <Text>Полное название вуза: {university.fullName}</Text>
        <br />
        <Link to="/admin/universities" style={{ color: '#1677ff', marginTop: '10px', display: 'inline-block' }}>
          &larr; Назад к списку вузов
        </Link>
      </div>

      <Table dataSource={university.faculties || []} rowKey="id" pagination={false}>
        
        {/* 1. Кнопка редактирования */}
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/universities/${id}/faculties/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

        {/* 2. Название факультета */}
        <Table.Column 
          dataIndex="fullName" 
          title="Название факультета" 
          render={(text, record) => (
            <Link 
              to={`/admin/universities/${id}/faculties/${record.id}/directions`} 
              style={{ fontWeight: 'bold', color: '#1677ff' }}
            >
              {text || record.shortName}
            </Link>
          )} 
        />

        <Table.Column dataIndex="shortName" title="Аббревиатура" width={150} />
        
        {/* Считаем количество направлений бакалавриата */}
        <Table.Column 
          title="Направлений (Б)" 
          width={150} 
          render={(_, r) => r.bachelor?.directionsList?.length || 0} 
        />
        
        {/* Считаем количество направлений магистратуры */}
        <Table.Column 
          title="Направлений (М)" 
          width={150} 
          render={(_, r) => r.master?.directionsList?.length || 0} 
        />

        {/* 3. Кнопка удаления */}
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)} 
            />
          )}
        />
      </Table>
    </List>
  );
}