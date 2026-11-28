import { List, DeleteButton } from "@refinedev/antd";
import { Table, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export function ProfessionList() {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/professions")
      .then((res) => res.json())
      .then((data) => setProfessions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;

  return (
    <List
      title="Профессии"
      headerButtons={
        <Link to="/admin/professions/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить профессию
          </Button>
        </Link>
      }
    >
      <Table dataSource={professions} rowKey="id" pagination={false}>

        <Table.Column
          width={50}
          render={(_, record) => (
            <Link to={`/admin/professions/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column dataIndex="name" title="Наименование" width={200} />

        <Table.Column
          title="Сфера"
          width={250}
          render={(_, record) => (record.sphereNames || []).join(", ") || "—"}
        />

        <Table.Column dataIndex="description" title="Описание" ellipsis />

        <Table.Column
          title="Спец-й"
          width={100}
          render={(_, record) => record.specialtyCount ?? 0}
        />

        <Table.Column
          width={50}
          render={(_, record) => (
            <DeleteButton
              hideText
              recordItemId={record.id}
              icon={<DeleteOutlined />}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
              confirmTitle="Удалить профессию?"
              confirmOkText="Удалить"
              confirmCancelText="Отмена"
              onSuccess={() => window.location.reload()}
            />
          )}
        />
      </Table>
    </List>
  );
}
