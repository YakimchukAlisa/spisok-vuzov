import { Form, Input, Button, message, Spin, Typography, Space, InputNumber, Divider, Checkbox, Select, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;
const SUBJECTS = ["Русский язык", "Математика", "Информатика", "Физика", "Химия", "Биология", "История", "Обществознание", "Иностранный язык"];

export function ProfileEdit() {
  const { id, facultyId, directionId, profileId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level") || "bachelor";

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [university, setUniversity] = useState(null);
  const [direction, setDirection] = useState(null);

  // Состояние для файлов
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/universities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const uni = Array.isArray(data) ? data[0] : data;
        setUniversity(uni);
        
        const fac = uni.faculties?.find(f => String(f.id) === String(facultyId));
        const dir = fac?.[level]?.directionsList?.find(d => String(d.id) === String(directionId));
        setDirection(dir);
        
        const prof = dir?.profiles?.find(p => String(p.id) === String(profileId));
        
        if (prof) {
          form.setFieldsValue({
            name: prof.name,
            description: prof.description,
            exams: prof.exams,
            fullTimeDuration: prof.educationForms?.fullTime?.duration,
            fullTimeBudgetPlaces: prof.educationForms?.fullTime?.budget?.places,
            fullTimeBudgetScore: prof.educationForms?.fullTime?.budget?.minScore,
            fullTimePaidPlaces: prof.educationForms?.fullTime?.paid?.places,
            fullTimePaidScore: prof.educationForms?.fullTime?.paid?.minScore,
            fullTimePrice: prof.educationForms?.fullTime?.paid?.price,
            partTimeDuration: prof.educationForms?.partTime?.duration,
            partTimeBudgetPlaces: prof.educationForms?.partTime?.budget?.places,
            partTimeBudgetScore: prof.educationForms?.partTime?.budget?.minScore,
            partTimePaidPlaces: prof.educationForms?.partTime?.paid?.places,
            partTimePaidScore: prof.educationForms?.partTime?.paid?.minScore,
            partTimePrice: prof.educationForms?.partTime?.paid?.price,
            files: prof.files || []
          }); 

          // Заполняем список файлов (выводим url как имя)
          const existingFiles = (prof.files || []).map((f, index) => ({
            uid: `existing-${index}`,
            name: f.url || f.name, // Показываем путь
            url: f.url, 
            status: 'done'
          }));
          setFileList(existingFiles);
        }
      })
      .finally(() => setInitialLoading(false));
  }, [id, facultyId, directionId, profileId, level, form]);

  const handleNameMatch = (e) => {
    if (e.target.checked && direction) {
      form.setFieldsValue({ name: direction.code_name || direction.name });
    } else {
      form.setFieldsValue({ name: "" });
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    const updatedList = newFileList.map(file => {
      if (!file.url) {
        let folderName = "";
        if (university?.imageUrl) {
          const parts = university.imageUrl.split('/');
          if (parts.length >= 3) folderName = parts[2].split('.')[0]; 
        }
        if (!folderName) folderName = "vuz";

        const path = `/img/${folderName}/${file.name}`;
        
        return { 
          ...file, 
          name: path, 
          url: path 
        };
      }
      return file;
    });

    setFileList(updatedList);
    
    form.setFieldsValue({ 
      files: updatedList.map(f => ({ name: f.name, url: f.url })) 
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fac = university.faculties.find(f => String(f.id) === String(facultyId));
      const dir = fac[level].directionsList.find(d => String(d.id) === String(directionId));
      
      const updatedProfiles = dir.profiles.map(p => 
        String(p.id) === String(profileId) 
          ? { 
              ...p, 
              name: values.name,
              description: values.description,
              exams: values.exams,
              files: values.files, 
              educationForms: {
                fullTime: {
                  name: "Очно",
                  duration: values.fullTimeDuration,
                  budget: { places: values.fullTimeBudgetPlaces, minScore: values.fullTimeBudgetScore },
                  paid: { places: values.fullTimePaidPlaces, minScore: values.fullTimePaidScore, price: values.fullTimePrice }
                },
                partTime: {
                  name: "Заочно",
                  duration: values.partTimeDuration,
                  budget: { places: values.partTimeBudgetPlaces, minScore: values.partTimeBudgetScore },
                  paid: { places: values.partTimePaidPlaces, minScore: values.partTimePaidScore, price: values.partTimePrice }
                }
              }
            } 
          : p
      );

      const updatedDirection = { ...dir, profiles: updatedProfiles };
      const updatedDirections = fac[level].directionsList.map(d => String(d.id) === String(directionId) ? updatedDirection : d);
      const updatedFaculties = university.faculties.map(f => String(f.id) === String(facultyId) ? { ...f, [level]: { ...f[level], directionsList: updatedDirections } } : f);

      await fetch(`http://localhost:3001/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...university, faculties: updatedFaculties }),
      });

      message.success("Профиль обновлен!");
      navigate(`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles?level=${level}`);
    } catch (error) {
      message.error("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <Space size="middle" align="center">
          <Link to={`/admin/universities/${id}/faculties/${facultyId}/directions/${directionId}/profiles?level=${level}`} style={{ color: '#000', fontSize: '20px' }}>
            <ArrowLeftOutlined />
          </Link>
          <Title level={3} style={{ margin: 0 }}>Редактировать профиль</Title>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Название профиля" required style={{ marginBottom: 0 }}>
          <Space align="start" style={{ display: 'flex', marginBottom: 8 }}>
            <Form.Item name="name" rules={[{ required: true }]} noStyle>
              <Input style={{ width: '400px' }} />
            </Form.Item>
            <Checkbox onChange={handleNameMatch}>Совпадает с названием направления</Checkbox>
          </Space>
        </Form.Item>
        
        <Form.Item label="Описание" name="description"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item label="Предметы (ЕГЭ)" name="exams"><Select mode="tags" options={SUBJECTS.map(s => ({ label: s, value: s }))} /></Form.Item>

        <Divider orientation="left">Очная форма обучения</Divider>
        <Space style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Form.Item label="Срок обучения" name="fullTimeDuration"><Input /></Form.Item>
          <Form.Item label="Бюджет: мест" name="fullTimeBudgetPlaces"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Бюджет: балл" name="fullTimeBudgetScore"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Платно: мест" name="fullTimePaidPlaces"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Платно: балл" name="fullTimePaidScore"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Платно: цена" name="fullTimePrice"><InputNumber min={0} /></Form.Item>
        </Space>

        <Divider orientation="left">Заочная форма обучения</Divider>
        <Space style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Form.Item label="Срок обучения" name="partTimeDuration"><Input /></Form.Item>
          <Form.Item label="Бюджет: мест" name="partTimeBudgetPlaces"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Бюджет: балл" name="partTimeBudgetScore"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Платно: мест" name="partTimePaidPlaces"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Платно: балл" name="partTimePaidScore"><InputNumber min={0} /></Form.Item>
          <Form.Item label="Платно: цена" name="partTimePrice"><InputNumber min={0} /></Form.Item>
        </Space>

        <Divider orientation="left">Документы</Divider>
        <Form.Item label="Загрузить документы (учебный план и т.д.)">
          <Upload 
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
          </Upload>
          <Form.Item name="files" noStyle />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ marginTop: 16 }}>
          Сохранить
        </Button>
      </Form>
    </div>
  );
}