import { List, DeleteButton } from "@refinedev/antd";
import { Table, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export function ProfessionList() {
  const [professions, setProfessions] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [spheres, setSpheres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/professions`).then(res => res.json()),
      fetch(`http://localhost:3001/universities`).then(res => res.json()),
      fetch(`http://localhost:3001/spheres`).then(res => res.json())
    ]).then(([profData, uniData, sphData]) => {
      setProfessions(Array.isArray(profData) ? profData : []);
      setUniversities(Array.isArray(uniData) ? uniData : []);
      setSpheres(Array.isArray(sphData) ? sphData : []);
      setLoading(false);
    }).catch(err => {
      console.error("Ошибка загрузки:", err);
      setLoading(false);
    });
  }, []);

  const renderSpheres = (prof) => {
    let profSpheres = [];
    
    // Если есть массив spheres
    if (prof.spheres && Array.isArray(prof.spheres)) {
      profSpheres = prof.spheres;
    } 
    // Если есть одиночный sphereId
    else if (prof.sphereId) {
      profSpheres = [prof.sphereId];
    }

    if (profSpheres.length === 0) return "—";

    const names = profSpheres.map(idOrCode => {
      // Ищем сферу либо по id, либо по code
      const sphere = spheres.find(s => 
        String(s.id) === String(idOrCode) || String(s.code) === String(idOrCode)
      );
      return sphere ? sphere.name : idOrCode;
    });

    return names.join(", ");
  };

  // 👇 Подсчет статистики
  const getStats = (prof) => {
    let profSpheres = [];
    if (prof.spheres && Array.isArray(prof.spheres)) {
      profSpheres = prof.spheres.map(String);
    } else if (prof.sphereId) {
      profSpheres = [String(prof.sphereId)];
    }

    if (profSpheres.length === 0) return "0 / 0";

    const uniqueSpecs = new Set(); 
    const uniqueVuzIds = new Set(); 

    universities.forEach(uni => {
      let vuzHasMatch = false;

      uni.faculties?.forEach(fac => {
        const dirs = [
          ...(fac.bachelor?.directionsList || []),
          ...(fac.master?.directionsList || [])
        ];

        dirs.forEach(dir => {
          // Приводим сферы направления к массиву строк
          let dirSpheres = [];
          if (Array.isArray(dir.spheres)) {
            dirSpheres = dir.spheres.map(String);
          } else if (dir.spheres !== undefined) {
            dirSpheres = [String(dir.spheres)];
          }

          // Проверяем, есть ли пересечение (сравниваем строки)
          const hasMatch = dirSpheres.some(ds => profSpheres.includes(ds));

          if (hasMatch) {
            uniqueSpecs.add(dir.code); 
            vuzHasMatch = true; 
          }
        });
      });

      if (vuzHasMatch) {
        uniqueVuzIds.add(uni.id);
      }
    });

    return `${uniqueSpecs.size} / ${uniqueVuzIds.size}`;
  };

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
          title=""
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
          render={(_, record) => renderSpheres(record)} 
        />

        <Table.Column dataIndex="description" title="Описание" ellipsis />
        
        <Table.Column 
          title="Спец. / Вузов" 
          width={130}
          render={(_, record) => getStats(record)} 
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