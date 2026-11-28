import { List, useTable, EditButton, DeleteButton, CreateButton } from "@refinedev/antd";
import { Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export function UniversityList() {
  const { tableProps } = useTable({
    resource: "universities",
    syncWithLocation: true,
  });

  return (
    <List
      title="Вузы"
      headerButtons={<CreateButton>Добавить вуз</CreateButton>}
    >
      <Table {...tableProps} rowKey="id" pagination={false} scroll={{ x: 1000 }}>
        <Table.Column
          width={50}
          render={(_, record) => (
            <EditButton
              hideText
              size="middle"
              recordItemId={record.id}
              icon={<EditOutlined />}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
            />
          )}
        />

        <Table.Column
          dataIndex="name"
          title="Название вуза"
          render={(text, record) => (
            <Link
              to={`/admin/universities/${record.id}/faculties`}
              style={{ fontWeight: 'bold', color: '#1677ff' }}
            >
              {text}
            </Link>
          )}
          width={220}
        />

        <Table.Column
          title="Город"
          width={140}
          render={(_, record) => record.gorod?.name || "—"}
        />

        <Table.Column
          title="Адрес"
          dataIndex="adress"
          width={200}
          render={(text) => text || "—"}
          ellipsis
        />

        <Table.Column dataIndex="email" title="Почта" width={180} render={(t) => t || "—"} />
        <Table.Column dataIndex="phone" title="Телефон" width={160} render={(t) => t || "—"} />

        <Table.Column
          width={50}
          render={(_, record) => (
            <DeleteButton
              hideText
              size="middle"
              recordItemId={record.id}
              icon={<DeleteOutlined />}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
              confirmTitle="Удалить вуз?"
              confirmOkText="Удалить"
              confirmCancelText="Отмена"
            />
          )}
        />
      </Table>
    </List>
  );
}
