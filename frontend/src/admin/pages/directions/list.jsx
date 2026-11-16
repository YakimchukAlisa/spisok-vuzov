import { List } from "@refinedev/antd";
import { Table, Spin, Typography, Button, message } from "antd"; // Убрали Tag
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function DirectionList() {
  const { id, facultyId } = useParams();
  const [university, setUniversity] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [spheres, setSpheres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/universities/${id}`).then(res => res.json()),
      fetch(`http://localhost:3001/spheres`).then(res => res.json())
    ]).then(([uniData, spheresData]) => {
      const uni = Array.isArray(uniData) ? uniData[0] : uniData;
      setUniversity(uni);
      
      const foundFaculty = uni.faculties?.find(f => String(f.id) === String(facultyId));
      setFaculty(foundFaculty);
      
      setSpheres(Array.isArray(spheresData) ? spheresData : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id, facultyId]);

  const handleDelete = async (directionId, isMaster = false) => {
    if (!window.confirm("Удалить это направление?")) return;
    try {
      const levelKey = isMaster ? "master" : "bachelor";
      const currentList = faculty[levelKey]?.directionsList || [];
      const updatedDirections = currentList.filter(d => d.id !== directionId);
      
      const updatedFaculties = university.faculties.map(f => 
        String(f.id) === String(facultyId) 
          ? { ...f, [levelKey]: { ...f[levelKey], directionsList: updatedDirections } }
          : f
      );

      await fetch(`http://localhost:3001/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...university, faculties: updatedFaculties }),
      });

      message.success("Направление удалено");
      window.location.reload(); 
    } catch (err) {
      message.error("Ошибка удаления");
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;
  if (!faculty) return <div>Факультет не найден</div>;

  const bachelorDirs = (faculty.bachelor?.directionsList || []).map(d => ({ ...d, level: "bachelor" }));
  const masterDirs = (faculty.master?.directionsList || []).map(d => ({ ...d, level: "master" }));
  const allDirections = [...bachelorDirs, ...masterDirs];

  // 👇 ВЫВОДИМ СФЕРЫ ПРОСТЫМ ТЕКСТОМ ЧЕРЕЗ ЗАПЯТУЮ
  const renderSpheres = (sphereCodes) => {
    if (!sphereCodes || !Array.isArray(sphereCodes) || sphereCodes.length === 0) return "—";
    
    const sphereNames = sphereCodes.map(code => {
      const sphere = spheres.find(s => s.code === code);
      return sphere ? sphere.name : code;
    });
    
    return sphereNames.join(", ");
  };

  return (
    <List
      title={`Направления: ${faculty.fullName || faculty.shortName}`}
      headerButtons={
        <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/create`}>
          <Button type="primary" icon={<PlusOutlined />}>Добавить направление</Button>
        </Link>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <Text>Вуз: {university.name}</Text>
        <br />
        <Link to={`/admin/universities/${id}/faculties`} style={{ color: '#1677ff', marginTop: '10px', display: 'inline-block' }}>
          &larr; Назад к факультетам
        </Link>
      </div>

      <Table dataSource={allDirections} rowKey="id" pagination={false}>
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/edit/${record.id}?level=${record.level}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />
        <Table.Column dataIndex="code" title="Код" width={120} />
        
        <Table.Column 
          dataIndex="code_name" 
          title="Название" 
          width={350}
          render={(text, record) => (
            <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${record.id}/profiles?level=${record.level}`} style={{ fontWeight: 'bold', color: '#1677ff' }}>
              {text || record.name}
            </Link>
          )} 
        />
        
        <Table.Column 
          dataIndex="spheres" 
          title="Сфера" 
          width={250}
          render={(sphereCodes) => renderSpheres(sphereCodes)} 
        />

        <Table.Column title="Профили" width={100} render={(_, record) => record.profiles?.length || 0} />
        
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.level === "master")} />
          )}
        />
      </Table>
    </List>
  );
}