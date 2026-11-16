import { Table, Button, Typography, Space, Modal, Form, Input, Select, message, Spin } from "antd";
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function TestOptions() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [spheres, setSpheres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Состояния для модального окна
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOption, setEditingOption] = useState(null); // null = создание, объект = редактирование
  const [form] = Form.useForm();

  const fetchData = () => {
    Promise.all([
      fetch(`http://localhost:3001/testQuestions/${id}`).then(res => res.json()),
      fetch(`http://localhost:3001/spheres`).then(res => res.json())
    ]).then(([qData, sData]) => {
      setQuestion(Array.isArray(qData) ? qData[0] : qData);
      setSpheres(Array.isArray(sData) ? sData : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (optionIndex) => {
    if (!window.confirm("Удалить этот ответ?")) return;
    try {
      const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
      await fetch(`http://localhost:3001/testQuestions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...question, options: updatedOptions }),
      });
      message.success("Ответ удален");
      fetchData();
    } catch (err) {
      message.error("Ошибка");
    }
  };

  const openModal = (option = null) => {
    setEditingOption(option);
    if (option) {
      form.setFieldsValue({ text: option.text, sphereId: option.sphereId });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let updatedOptions = [...(question.options || [])];

      if (editingOption) {
        // Редактирование
        const index = updatedOptions.findIndex(o => o.text === editingOption.text);
        if (index !== -1) updatedOptions[index] = values;
      } else {
        // Создание
        updatedOptions.push(values);
      }

      await fetch(`http://localhost:3001/testQuestions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...question, options: updatedOptions }),
      });
      
      message.success("Сохранено!");
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;
  if (!question) return <div>Вопрос не найден</div>;

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <Space size="middle" align="center">
          <Link to="/admin/test" style={{ color: '#000', fontSize: '20px' }}><ArrowLeftOutlined /></Link>
          <Title level={3} style={{ margin: 0 }}>Ответы: {question.question}</Title>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Добавить ответ
        </Button>
      </div>

      <Table 
        dataSource={question.options?.map((o, i) => ({ ...o, key: i })) || []} 
        pagination={false}
      >
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
          )}
        />
        <Table.Column dataIndex="text" title="Текст ответа" />
        <Table.Column 
          title="Сфера" 
          width={250}
          render={(_, record) => {
            const sphere = spheres.find(s => Number(s.id) === Number(record.sphereId));
            return sphere ? sphere.name : "Не выбрана";
          }} 
        />
        <Table.Column
          title=""
          width={50}
          render={(_, record) => (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
          )}
        />
      </Table>

      <Modal 
        title={editingOption ? "Редактировать ответ" : "Добавить ответ"} 
        open={isModalVisible} 
        onOk={handleModalOk} 
        onCancel={() => setIsModalVisible(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Текст ответа" name="text" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Сфера" name="sphereId" rules={[{ required: true }]}>
            <Select options={spheres.map(s => ({ label: s.name, value: s.id }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}