export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productName, sellingPoint, offer } = req.body;

  // 从环境变量获取 API KEY
  const API_KEY = process.env.DIFY_API_KEY;

  // 构造提示词
  let prompt = `商品名称：${productName}\n核心卖点：${sellingPoint}`;
  if (offer && offer.trim()) {
    prompt += `\n促销/赠品信息：${offer}`;
  } else {
    prompt += `\n促销/赠品信息：无（请在CTA环节自由发挥通用促销话术）`;
  }

  try {
    const response = await fetch('https://api.dify.ai/v1/completion-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          product_name: productName,
          selling_point: sellingPoint,
          offer: offer || "无特殊促销"
        },
        response_mode: "blocking",
        user: "merchant_user_1"
      })
    });

    const data = await response.json();
    
    if (data.answer) {
      res.status(200).json({ status: 'success', content: data.answer });
    } else {
      console.error('Dify 返回错误:', data);
      res.status(200).json({ status: 'error', message: data.message || '生成失败' });
    }
  } catch (error) {
    console.error('API 调用出错:', error);
    res.status(500).json({ status: 'error', message: '服务器内部错误' });
  }
}