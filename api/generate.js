export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productName, sellingPoint, offer } = req.body;

  // 这里的 KEY 是存在服务器环境变量里的，很安全
  const API_KEY = process.env.DIFY_API_KEY; 

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
          "offer": offer
        },
        response_mode: "blocking",
        user: "web-user"
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}