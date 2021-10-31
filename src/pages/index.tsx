import { Button, Descriptions, Input } from 'antd';
import './index.less';
import { useState } from 'react';

const nutritions = ['Protein']

export default function IndexPage() {
  const [searchVal, setSearchVal] = useState('')
  // https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=zh-CN&q=
  // https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=pE33hLApRetG8zK7GTzXRMxcgmcYb8XdlqmD7e1S
  const onSearch = async () => {
    const translationRes = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=zh-CN&tl=en&q='+searchVal)
    const translation = await translationRes.json()
    const foodRes = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${translation}&pageSize=2&api_key=pE33hLApRetG8zK7GTzXRMxcgmcYb8XdlqmD7e1S`)
    const food = await foodRes.json()
    console.log(food)
  }

  return (
    <div className='root'>
      <div className='left'>
        <div className='title'>营养计算</div>
      </div>
      <div className='right'>
        <div className='title'>食物营养查询</div>
        <div className='search'>
          <Input value={searchVal} onChange={(e)=>setSearchVal(e.target.value)}></Input>
          <Button type='primary' onClick={onSearch}>搜索</Button>
        </div>
        <Descriptions>
          <Descriptions.Item label='名称'>1</Descriptions.Item>
          <Descriptions.Item label='单位含量'>每100g</Descriptions.Item>
          <Descriptions.Item label='能量'></Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}
