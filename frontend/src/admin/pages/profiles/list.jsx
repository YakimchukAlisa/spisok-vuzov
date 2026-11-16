import { List } from "@refinedev/antd";
import { Table, Spin, Typography, Button, message } from "antd";
import { useParams, Link, useSearchParams } from "react-router-dom"; // <-- Добавили useSearchParams
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function ProfileList() {
  const { id, facultyId, directionId } = useParams();
  const [searchParams] = useSearchParams();
  
  // 👇 Читаем уровень (bachelor или master) из URL. По умолчанию bachelor.
  const level = searchParams.get("level") || "bachelor"; 

  const [direction, setDirection] = useState(null);
  const [university, setUniversity] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch(`http://localhost:3001/universities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const uni = Array.isArray(data) ? data[0] : data;
        setUniversity(uni);
        
        const fac = uni.faculties?.find(f => String(f.id) === String(facultyId));
        setFaculty(fac);

        // 👇 Ищем направление в нужном списке (bachelor или master)
        const dir = fac?.[level]?.directionsList?.find(d => String(d.id) === String(directionId));
        setDirection(dir);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, facultyId, directionId, level]);

  const handleDelete = async (profileId) => {
    if (!window.confirm("Удалить этот профиль?")) return;
    try {
      const updatedProfiles = direction.profiles.filter(p => p.id !== profileId);
      
      const updatedDirections = faculty[level].directionsList.map(d => 
        String(d.id) === String(directionId) ? { ...d, profiles: updatedProfiles } : d
      );

      const updatedFaculties = university.faculties.map(f => 
        String(f.id) === String(facultyId) 
          ? { ...f, [level]: { ...f[level], directionsList: updatedDirections } }
          : f
      );

      await fetch(`http://localhost:3001/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...university, faculties: updatedFaculties }),
      });

      message.success("Профиль удален");
      fetchData();
    } catch (err) {
      message.error("Ошибка удаления");
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;
  if (!direction) return <div>Направление не найдено</div>;

  const profiles = direction.profiles || [];

  return (
    <List
      title={`Профили: ${direction.code_name || direction.name}`}
      headerButtons={
        <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles/create?level=${level}`}>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить профиль
          </Button>
        </Link>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <Text>Код направления: {direction.code}</Text>
        <br />
        <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions`} style={{ color: '#1677ff', marginTop: '10px', display: 'inline-block' }}>
          &larr; Назад к направлениям
        </Link>
      </div>

      <Table dataSource={profiles} rowKey="id" pagination={false} scroll={{ x: 1200 }}>
        
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles/edit/${record.id}?level=${level}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

        <Table.Column dataIndex="name" title="Наименование" width={250} render={(text) => <strong>{text}</strong>} />
        

        <Table.Column title="Бюджет (мест)" width={120} render={(_, r) => r.budget?.places || 0} />
        <Table.Column title="Платно (мест)" width={120} render={(_, r) => r.paid?.places || 0} />
        <Table.Column title="Стоимость" width={130} render={(_, r) => r.paid?.price ? `${r.paid.price} ₽` : "—"} />
        
        <Table.Column 
          title="Баллы (Бюдж/Плат)" 
          width={160} 
          render={(_, r) => `${r.budget?.minScore || 0} / ${r.paid?.minScore || 0}`} 
        />

        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          )}
        />
      </Table>
    </List>
  );
}