import { List } from "@refinedev/antd";
import { Table, Typography, Spin, Button, message } from "antd";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function ProfileList() {
  const { id, facultyId, directionId } = useParams();
  const [direction, setDirection] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:8080/api/napravleniya/${directionId}`),
      fetch(`http://localhost:8080/api/napravlenie/${directionId}/profili-admin`),
    ])
      .then(([dirRes, profRes]) => Promise.all([dirRes.json(), profRes.json()]))
      .then(([dir, profs]) => {
        setDirection(dir);
        setProfiles(Array.isArray(profs) ? profs : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [directionId]);

  const handleDelete = async (profileId) => {
    if (!window.confirm("Удалить этот профиль?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/profil/${profileId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        message.warning(body?.message || "Не удалось удалить профиль");
        return;
      }

      message.success("Профиль удален");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Ошибка удаления");
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;
  if (!direction) return <div>Направление не найдено</div>;

  return (
    <List
      title={`Профили: ${direction.name}`}
      headerButtons={
        <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles/create`}>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить профиль
          </Button>
        </Link>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <Text>Код направления: {direction.kod}</Text>
        <br />
        <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions`} style={{ color: '#1677ff', marginTop: '10px', display: 'inline-block' }}>
          &larr; Назад к направлениям
        </Link>
      </div>

      <Table dataSource={profiles} rowKey="profileId" pagination={false} scroll={{ x: 1200 }}>

        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles/edit/${record.profileId}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

        <Table.Column
          dataIndex="name"
          title="Наименование"
          width={250}
          render={(text) => <strong>{text}</strong>}
        />

        <Table.Column dataIndex="forma" title="Форма" width={110} render={(t) => t || "—"} />
        <Table.Column dataIndex="uroven" title="Уровень" width={130} render={(t) => t || "—"} />

        <Table.Column title="Бюджет (мест)" width={120} render={(_, r) => r.budgetPlaces ?? 0} />
        <Table.Column title="Платно (мест)" width={120} render={(_, r) => r.paidPlaces ?? 0} />
        <Table.Column
          title="Стоимость"
          width={130}
          render={(_, r) => (r.paidMinPrice ? `${r.paidMinPrice.toLocaleString("ru-RU")} ₽` : "—")}
        />
        <Table.Column
          title="Баллы (Бюдж/Плат)"
          width={160}
          render={(_, r) => `${r.budgetMinScore ?? 0} / ${r.paidMinScore ?? 0}`}
        />

        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.profileId)} />
          )}
        />
      </Table>
    </List>
  );
}
