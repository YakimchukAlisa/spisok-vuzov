import { List, DeleteButton, useTable } from "@refinedev/antd";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export function SphereList() {
  const { tableProps } = useTable({
    resource: "spheres",
    syncWithLocation: true,
  });

  return (
    <List
      title="Сферы"
      headerButtons={
        <Link to="/admin/spheres/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить сферу
          </Button>
        </Link>
      }
    >
      <Table {...tableProps} rowKey="id" pagination={false}>
        
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/spheres/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />

        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column dataIndex="name" title="Наименование сферы" />
        
        <Table.Column 
          dataIndex="imageUrl" 
          title="Ссылка на иконку" 
          render={(text) => text || "—"} 
        />

        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <DeleteButton 
              hideText 
              recordItemId={record.id} 
              icon={<DeleteOutlined />}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
              confirmTitle="Удалить сферу?" 
              confirmOkText="Удалить" 
              confirmCancelText="Отмена"
            />
          )}
        />
      </Table>
    </List>
  );
}