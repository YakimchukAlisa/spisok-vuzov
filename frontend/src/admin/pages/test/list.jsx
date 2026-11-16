import { List, DeleteButton } from "@refinedev/antd";
import { Table, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export function TestQuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = () => {
    setLoading(true);
    fetch(`http://localhost:3001/testQuestions`)
      .then(res => res.json())
      .then(data => setQuestions(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот вопрос?")) return;
    try {
      await fetch(`http://localhost:3001/testQuestions/${id}`, { method: "DELETE" });
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;

  return (
    <List
      title="Вопросы теста"
      headerButtons={
        <Link to="/admin/test/create">
          <Button type="primary" icon={<PlusOutlined />}>Добавить вопрос</Button>
        </Link>
      }
    >
      <Table dataSource={questions} rowKey="id" pagination={false}>
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Link to={`/admin/test/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          )}
        />
        <Table.Column dataIndex="id" title="ID" width={80} />
        
        <Table.Column 
          dataIndex="question" 
          title="Вопрос" 
          render={(text, record) => (
            <Link to={`/admin/test/${record.id}/options`} style={{ fontWeight: 'bold', color: '#1677ff' }}>
              {text}
            </Link>
          )} 
        />
        
        <Table.Column 
          title="Кол-во ответов" 
          width={150}
          render={(_, record) => record.options?.length || 0} 
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