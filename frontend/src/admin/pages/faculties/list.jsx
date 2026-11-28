import { List } from "@refinedev/antd";
import { Table, Typography, Spin, message, Button } from "antd";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function FacultyList() {
  const { id } = useParams(); // ID вуза
  const [university, setUniversity] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:8080/api/vuz/admin-list/${id}`),
      fetch(`http://localhost:8080/api/vuz/${id}/fakultety`),
    ])
      .then(([uniRes, facRes]) => Promise.all([uniRes.json(), facRes.json()]))
      .then(([uni, facs]) => {
        setUniversity(uni);
        setFaculties(Array.isArray(facs) ? facs : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот факультет?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/fakultet/${facultyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Статус ${res.status}`);

      message.success("Факультет удален");
      fetchData();
    } catch (err) {
      console.error(err);
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
        <Text>Полное название вуза: {university.name}</Text>
        <br />
        <Link to="/admin/universities" style={{ color: '#1677ff', marginTop: '10px', display: 'inline-block' }}>
          &larr; Назад к списку вузов
        </Link>
      </div>

      <Table dataSource={faculties} rowKey="id" pagination={false}>

        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/universities/${id}/faculties/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

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

        <Table.Column
          title="Направлений (Б)"
          width={150}
          render={(_, r) => r.bachelor?.directions ?? 0}
        />

        <Table.Column
          title="Направлений (М)"
          width={150}
          render={(_, r) => r.master?.directions ?? 0}
        />

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
