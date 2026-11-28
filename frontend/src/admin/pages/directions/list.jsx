import { List } from "@refinedev/antd";
import { Table, Typography, Spin, Button, message } from "antd";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function DirectionList() {
  const { id, facultyId } = useParams(); // id вуза, facultyId — факультета
  const [facultyName, setFacultyName] = useState("");
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:8080/api/vuz/${id}/napravleniya`),
      fetch(`http://localhost:8080/api/fakultet/${facultyId}`),
    ])
      .then(([dirRes, facRes]) => Promise.all([dirRes.json(), facRes.json()]))
      .then(([allDirections, faculty]) => {
        setFacultyName(faculty?.name || "");
        setDirections(
          (Array.isArray(allDirections) ? allDirections : []).filter(
            (d) => String(d.fakultetId) === String(facultyId)
          )
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, facultyId]);

  const handleDelete = async (directionId) => {
    if (!window.confirm("Вы уверены, что хотите удалить это направление?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/napravleniya/${directionId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        // 409 — у направления есть профили; показываем причину с бэкенда
        const body = await res.json().catch(() => null);
        message.warning(body?.message || "Не удалось удалить направление");
        return;
      }

      message.success("Направление удалено");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Ошибка удаления");
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;

  return (
    <List
      title={`Направления: ${facultyName}`}
      headerButtons={
        <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/create`}>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить направление
          </Button>
        </Link>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/admin/universities/${id}/faculties`} style={{ color: '#1677ff', display: 'inline-block' }}>
          &larr; Назад к факультетам
        </Link>
      </div>

      <Table dataSource={directions} rowKey="id" pagination={false}>

        <Table.Column
          width={50}
          render={(_, record) => (
            <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

        <Table.Column dataIndex="kod" title="Код" width={100} />

        <Table.Column
          dataIndex="name"
          title="Наименование"
          render={(text, record) => (
            <Link
              to={`/admin/universities/${id}/faculties/${facultyId}/directions/${record.id}/profiles`}
              style={{ fontWeight: 'bold', color: '#1677ff' }}
            >
              {text}
            </Link>
          )}
        />

        <Table.Column
          title="Сферы"
          width={120}
          render={(_, r) => (r.sphereIds?.length ? `${r.sphereIds.length} сф.` : "—")}
        />

        <Table.Column
          title="Профилей"
          width={120}
          render={(_, record) => (
            <Link
              to={`/admin/universities/${id}/faculties/${facultyId}/directions/${record.id}/profiles`}
              style={{ color: '#1677ff' }}
            >
              {record.profiles?.length || 0}
            </Link>
          )}
        />

        <Table.Column
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
