export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productName, sellingPoint, offer } = req.body;

  // 从环境变量获取 API KEY
  const API_KEY = process.env.DIFY_API_KEY;

  try {
    const response = await fetch('https://api.dify.ai/v1/completion-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          product_name: productName || "",
          selling_point: sellingPoint || "",
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
      res.status(200).json({ status: 'error', message: data.message || JSON.stringify(data) });
    }
  } catch (error) {
    console.error('API 调用出错:', error);
    res.status(500).json({ status: 'error', message: '服务器内部错误: ' + error.message });
  }
}