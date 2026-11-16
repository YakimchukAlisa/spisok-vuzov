import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const CITIES = ["Москва", "Санкт-Петербург", "Барнаул", "Томск", "Екатеринбург", "Новосибирск"];
const DEFAULT_FEATURES = ["Общежитие", "Военный учебный центр", "Автошкола", "Бассейн"];

export function UniversityCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: "universities" });

  const handleUpload = (file, form, fieldType) => {
    // 1. Берем имя файла без расширения (например, из "altgtu.jpg" получаем "altgtu")
    const folderName = file.name.split('.')[0].toLowerCase(); 
    
    // 2. Всегда формируем путь в папку /img/имя_файла/имя_файла.расширение
    const path = `/img/${folderName}/${file.name}`;
    
    // 3. Записываем путь в нужное поле (imageUrl для картинки, logoUrl для логотипа)
    form.setFieldsValue({ [fieldType === 'img' ? 'imageUrl' : 'logoUrl']: path });
    
    message.success(`Путь сохранен: ${path}`);
    return false;
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Добавить вуз">
      <Form {...formProps} layout="vertical">
        
        <Form.Item label="Полное наименование" name="fullName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Аббревиатура" name="name" rules={[{ required: true }]}>
          <Input placeholder="АлтГТУ" />
        </Form.Item>

        <Form.Item label="Город" name="city" rules={[{ required: true }]}>
          <Select showSearch mode="tags" maxCount={1} options={CITIES.map(c => ({ label: c, value: c }))} />
        </Form.Item>

        <Form.Item label="Адрес (улица, дом)" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Почта" name={["contacts", "email"]}>
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Телефон" name={["contacts", "phone"]}>
          <Input />
        </Form.Item>

        {/* --- ЗАГРУЗКА КАРТИНКИ --- */}
        <Form.Item label="Картинка вуза" shouldUpdate>
          {({ setFieldsValue }) => (
            <div>
              <Upload beforeUpload={(file) => handleUpload(file, { setFieldsValue }, 'img')} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Выбрать картинку</Button>
              </Upload>
              <Form.Item name="imageUrl" noStyle>
                <Input placeholder="/img/altgtu/altgtu.jpg" readOnly style={{ marginTop: 8 }} />
              </Form.Item>
            </div>
          )}
        </Form.Item>

        {/* --- ЗАГРУЗКА ЛОГОТИПА --- */}
        <Form.Item label="Логотип" shouldUpdate>
          {({ setFieldsValue }) => (
            <div>
              <Upload beforeUpload={(file) => handleUpload(file, { setFieldsValue }, 'logo')} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Выбрать логотип</Button>
              </Upload>
              <Form.Item name="logoUrl" noStyle>
                <Input placeholder="/img/altgtu/altgtu.svg" readOnly style={{ marginTop: 8 }} />
              </Form.Item>
            </div>
          )}
        </Form.Item>

        <Form.Item label="Дополнительные возможности" name="features">
          <Select mode="tags" placeholder="Выберите или введите свои..." options={DEFAULT_FEATURES.map(f => ({ label: f, value: f }))} />
        </Form.Item>

        <Form.Item label="Сайт вуза" name={["socials", "website"]}>
          <Input placeholder="https://altgtu.ru/" />
        </Form.Item>
        <Form.Item label="ВКонтакте" name={["socials", "vk"]}>
          <Input placeholder="https://vk.com/altgtu" />
        </Form.Item>
        <Form.Item label="Telegram" name={["socials", "telegram"]}>
          <Input placeholder="https://t.me/altgtu" />
        </Form.Item>
        <Form.Item label="MAX" name={["socials", "max"]}>
          <Input placeholder="https://max.ru/..." />
        </Form.Item>

      </Form>
    </Create>
  );
}