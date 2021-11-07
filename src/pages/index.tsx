import { Button, Descriptions, Input, message, Spin } from 'antd';
import './index.less';
import { useState } from 'react';
import { infoConfig } from './config';
import Calculation from './Calculation';
import { useEffect } from 'react';

export default function IndexPage() {
  const [searchVal, setSearchVal] = useState('');
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const nutritionKeys = infoConfig.map((item) => item.key);

  useEffect(() => {
    if (navigator.userAgent.toLowerCase().includes('mobile')) {
      const container = document.querySelector('.root');
      console.log(container);
      if (container) {
        container.style.position = 'static';
        container.style.transform = 'none';
      }
    }
  }, []);

  const translate = async (val: string, sl = 'zh-CN', tl = 'en') => {
    const translationRes = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${sl}&tl=${tl}&q=${val}`,
    );
    return (await translationRes.json())[0][0][0];
  };

  const handleFoodData = async (food: any) => {
    const nutritions = food.foodNutrients.filter((item: any) => {
      return nutritionKeys.find((ele) => {
        if (item.nutrientName.toLowerCase().includes(ele)) {
          item.key = ele;
          return true;
        }
      });
    });
    const name = await translate(food.description.split(',')[0], 'en', 'zh-CN');
    const info: any = {
      name: name,
    };
    nutritions.forEach((item: any) => {
      info[item.key] = item.value + ' ' + item.unitName.toLowerCase();
    });
    setInfo(info);
  };

  // https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=zh-CN&q=
  // https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=pE33hLApRetG8zK7GTzXRMxcgmcYb8XdlqmD7e1S
  const onSearch = async () => {
    if (!setSearchVal) return;
    setLoading(true);
    const translation = await translate(searchVal);
    const foodRes = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=pE33hLApRetG8zK7GTzXRMxcgmcYb8XdlqmD7e1S`,
      {
        body: JSON.stringify({
          includeDataTypes: {
            'Survey (FNDDS)': true,
          },
          query: translation,
          pageSize: 2,
        }),
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    const data = await foodRes.json();
    const food = data.foods[0];
    if (food) {
      await handleFoodData(food);
    } else {
      message.error('请求失败，请重试！');
    }
    setLoading(false);
  };

  return (
    <div className="root">
      <div className="left">
        <div className="title">营养计算</div>
        <Calculation></Calculation>
      </div>
      <div className="right">
        <div className="title">食物营养查询</div>
        <div className="search">
          <Input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          ></Input>
          <Button type="primary" onClick={onSearch}>
            搜索
          </Button>
        </div>
        <Spin spinning={loading}>
          <Descriptions bordered size="middle" column={1}>
            {infoConfig.map((item) => (
              <Descriptions.Item label={item.label} key={item.key}>
                {item.content || info[item.key]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Spin>
      </div>
    </div>
  );
}
