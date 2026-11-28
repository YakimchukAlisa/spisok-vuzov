import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

export function UniversityCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: "universities" });

  const [cities, setCities] = useState([]);
  const [vozmOptions, setVozmOptions] = useState([]);

  useEffect(() => {
    fetch(`${API}/vuz/goroda`)
      .then((r) => r.json())
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Не удалось загрузить города:", e));

    fetch(`${API}/vuz/vozm`)

      .then((r) => r.json())
      .then((d) => setVozmOptions(Array.isArray(d) ? d : []))
      .catch((e) => console.error("Не удалось загрузить возможности:", e));
  }, []);

  const handleUpload = (file, form) => {
    const folderName = file.name.split('.')[0].toLowerCase();
    const path = `/img/${folderName}/${file.name}`;
    form.setFieldsValue({ imageUrl: path });
    message.success(`Путь сохранен: ${path}`);
    return false;
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Добавить вуз">
      <Form {...formProps} layout="vertical">

        <Form.Item label="Полное наименование" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Аббревиатура" name="abbreviatura" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* gorod — вложенное поле: на сервер уйдёт объект { name: "Барнаул" },
            контроллер сам найдёт город по имени (а нового создаст) */}
        <Form.Item
          label="Город"
          name={["gorod", "name"]}
          rules={[{ required: true }]}
          getValueFromEvent={(value) => (Array.isArray(value) ? value[0] : value)}
          getValueProps={(value) => ({ value: value ? [value] : [] })}
        >
          <Select
            showSearch
            mode="tags"
            maxCount={1}
            options={cities.map((c) => ({ label: c, value: c }))}
            placeholder="Выберите или введите новый город"
          />
        </Form.Item>

        <Form.Item label="Адрес" name="adress">
          <Input />
        </Form.Item>

        <Form.Item label="Почта" name="email">
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Телефон" name="phone">
          <Input />
        </Form.Item>

        {/* --- ЗАГРУЗКА КАРТИНКИ --- */}
        <Form.Item label="Картинка вуза">
          <div>
            <Upload
              beforeUpload={(file) => handleUpload(file, formProps.form, "img")}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Выбрать картинку</Button>
            </Upload>
            <Form.Item name="imageUrl" noStyle>
              <Input placeholder="/img/altgtu/altgtu.jpg" readOnly style={{ marginTop: 8 }} />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item label="Сайт" name="site">
          <Input placeholder="https://altgtu.ru/" />
        </Form.Item>
        <Form.Item label="ВКонтакте" name="vkUrl">
          <Input placeholder="https://vk.com/altgtu" />
        </Form.Item>
        <Form.Item label="Telegram" name="telegramUrl">
          <Input placeholder="https://t.me/altgtu" />
        </Form.Item>
        <Form.Item label="MAX" name="maxUrl">
          <Input placeholder="https://max.ru/..." />
        </Form.Item>

        {/* --- ДОП. ВОЗМОЖНОСТИ --- */}
        <Form.Item label="Доп. возможности" name="vozmIds">
          <Select
            mode="multiple"
            placeholder="Общежитие, военный учебный центр..."
            options={vozmOptions.map((v) => ({ label: v.name, value: v.id }))}
          />
        </Form.Item>

      </Form>
    </Create>
  );
}
