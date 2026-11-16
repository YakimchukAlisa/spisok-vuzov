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
        
        {/* 1. Редактирование (Карандашик) */}
        <Table.Column
          title=""
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

        {/* 2. Название (ссылка на факультеты) */}
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

        {/* 3. Город (берем из поля city) */}
        <Table.Column 
          title="Город" 
          width={140}
          render={(_, record) => record.city || "—"} 
        />

        {/* 4. Адрес (показываем улицу, если нужно) */}
        <Table.Column 
          title="Адрес" 
          width={200}
          render={(_, record) => record.address || "—"} 
          ellipsis
        />

        {/* 5. Почта */}
        <Table.Column 
          title="Почта" 
          width={180}
          render={(_, record) => record.contacts?.email || "—"} 
        />

        {/* 6. Телефон (вместо бюджета) */}
        <Table.Column 
          title="Телефон" 
          width={160}
          render={(_, record) => record.contacts?.phone || "—"} 
        />

        {/* 7. Количество факультетов */}
        <Table.Column 
          title="Факультеты" 
          width={120}
          render={(_, record) => record.faculties ? record.faculties.length : 0} 
        />

        {/* 8. Удаление (Корзинка) */}
        <Table.Column
          title=""
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