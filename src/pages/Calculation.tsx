import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Statistic,
} from 'antd';
import React from 'react';
import { useState } from 'react';

const span = 8;
const rules: any = [
  { required: true, message: '请填写' },
  {
    type: 'number',
    transform: (val) => -val,
    message: '请输入数字',
  },
];

function Calculation() {
  const [form] = Form.useForm();
  const [info, setInfo] = useState<any>({
    protein: '-',
    energy: '-',
    carbohydrate: '-',
    fat: '-',
  });

  const fixData = (val: any) => {
    return Math.round(val * 10) / 10;
  };

  // 计算碳水
  const calCarbon = (energy: number, protein: number, fat: number) => {
    return fixData((energy - protein * 4 - fat) / 4);
  };

  const onCalculate = async () => {
    await form.validateFields();
    const { weight, fat, k, target } = form.getFieldsValue();
    const energy =
      (parseFloat(weight) * (1 - parseFloat(fat) / 100) * 22 + 500) *
      parseFloat(k);
    let energyTxt = { min: 0, max: 0, txt: '-' };
    let protein = { min: 0, max: 0, txt: '-' };
    let fatTxt = { min: 0, max: 0, txt: '-' };
    let carbonText = '-';
    if (target === 1) {
      energyTxt.min = fixData(energy);
      energyTxt.txt = `≈${energyTxt.min}`;
      protein.min = fixData(1.5 * parseFloat(weight));
      protein.txt = `≈${protein.min}`;
      fatTxt.min = fixData(energy * 0.2);
      fatTxt.txt = `≈${fatTxt.min}`;
      carbonText = `≈${calCarbon(energyTxt.min, protein.min, fatTxt.min)}`;
    } else if (target === 2) {
      energyTxt.min = fixData(energy + 200);
      energyTxt.max = fixData(energy + 500);
      energyTxt.txt = `${energyTxt.min}~${energyTxt.max}`;
      protein.min = fixData(1.6 * parseFloat(weight));
      protein.max = fixData(1.8 * parseFloat(weight));
      protein.txt = `${protein.min}~${protein.max}`;
      fatTxt.min = fixData(energy * 0.2);
      fatTxt.max = fixData(energy * 0.3);
      fatTxt.txt = `${fatTxt.min}~${fatTxt.max}`;
      carbonText = `${calCarbon(
        energyTxt.max,
        protein.max,
        fatTxt.max,
      )}~${calCarbon(energyTxt.min, protein.min, fatTxt.min)}`;
    } else {
      energyTxt.min = fixData(energy - 500);
      energyTxt.max = fixData(energy - 200);
      energyTxt.txt = `${energyTxt.min}~${energyTxt.max}`;
      protein.min = fixData(1.6 * parseFloat(weight));
      protein.max = fixData(2.4 * parseFloat(weight));
      protein.txt = `${protein.min}~${protein.max}`;
      fatTxt.min = fixData(energy * 0.15);
      fatTxt.max = fixData(energy * 0.25);
      fatTxt.txt = `${fatTxt.min}~${fatTxt.max}`;
      carbonText = `${calCarbon(
        energyTxt.max,
        protein.max,
        fatTxt.max,
      )}~${calCarbon(energyTxt.min, protein.min, fatTxt.min)}`;
    }
    setInfo({
      ...info,
      energy: energyTxt.txt,
      protein: protein.txt,
      fat: fatTxt.txt,
      carbohydrate: carbonText,
    });
  };

  const statisticConfig = [
    {
      title: '热量',
      key: 'energy',
      suffix: 'kcal',
    },
    {
      title: '蛋白质',
      key: 'protein',
      suffix: 'g',
    },
    {
      title: '碳水',
      key: 'carbohydrate',
      suffix: 'g',
    },
    {
      title: '脂肪',
      key: 'fat',
      suffix: 'kcal',
    },
  ];

  return (
    <div style={{ padding: '10px' }}>
      <Form form={form}>
        <Row gutter={16}>
          <Col span={span}>
            <Form.Item label="体重" name="weight" rules={rules}>
              <Input suffix="kg"></Input>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="体脂" name="fat" rules={rules}>
              <Input suffix="%"></Input>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label={
                <Popover
                  content={
                    <>
                      <div>基本不运动：1.4 ~ 1.5</div>
                      <div>偶尔运动：1.6 ~ 1.7</div>
                      <div>经常运动：1.8 ~ 1.9</div>
                      <div>高强度运动：2.0 ~ 2.4</div>
                    </>
                  }
                >
                  活动系数
                </Popover>
              }
              name="k"
              rules={rules}
            >
              <Input></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={16}>
          <Col span={span}>
            <Form.Item label="目标" name="target" initialValue={1}>
              <Select
                options={[
                  { label: '保持', value: 1 },
                  { label: '增肌', value: 2 },
                  { label: '减脂', value: 3 },
                ]}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item>
              <Button type="primary" onClick={onCalculate}>
                计算
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Row gutter={10}>
        {statisticConfig.map((item) => (
          <Col span={12} key={item.key} style={{ marginBlock: '10px' }}>
            <Statistic
              title={item.title}
              value={info[item.key]}
              suffix={item.suffix}
            ></Statistic>
          </Col>
        ))}
      </Row>
      <Divider />
    </div>
  );
}

export default Calculation;
