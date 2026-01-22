// api/generate.js

export default async function handler(req, res) {
  // 1. 允许跨域 (CORS) - 方便您在本地调试，上线也更灵活
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productName, sellingPoint, offer } = req.body;

  // ⚠️ 这里为了演示方便，我把Key先写死在这里。
  // 真正上线到 Vercel 后，要在 Vercel 后台的 Environment Variables 里设置 DIFY_API_KEY
  const API_KEY = process.env.DIFY_API_KEY || 'app-GWeMiYKLDM2vxSSgXYLuXn5B'; 

  try {
    const response = await fetch('https://api.dify.ai/v1/completion-messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          "product_name": productName,
          "selling_point": sellingPoint,
          "offer": offer || "暂无优惠" // 防止空值报错
        },
        response_mode: "blocking",
        user: "web-user-commercial"
      })
    });

    const data = await response.json();
    
    // 增加一些错误处理，方便您调试
    if (data.status === 404 || data.status === 400 || data.code) {
        return res.status(400).json({ error: data.message || "Dify API 调用失败" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}