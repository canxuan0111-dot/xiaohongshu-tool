from flask import Flask, render_template, request, jsonify
import requests
import json
import os

app = Flask(__name__, template_folder='../templates', static_folder='../public')

# ================= 配置区 =================
# 从环境变量读取 API Key（Vercel 会注入）
DIFY_API_KEY = os.environ.get('DIFY_API_KEY', 'app-GWeMiYKLDM2vxSSgXYLuXn5B')
# Dify API 的 URL
DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages'
# ==========================================

@app.route('/')
def index():
    """渲染首页"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_note():
    """处理生成请求的 API 接口"""
    data = request.json
    product_name = data.get('product_name')
    features = data.get('features')
    promotion = data.get('promotion', '')

    # 构造发送给 Dify 的消息
    input_text = f"商品名称：{product_name}\n核心卖点：{features}"
    
    if promotion and promotion.strip():
         input_text += f"\n促销/赠品信息：{promotion}"
    else:
         input_text += f"\n促销/赠品信息：无（请在CTA环节自由发挥通用促销话术）"

    headers = {
        'Authorization': f'Bearer {DIFY_API_KEY}',
        'Content-Type': 'application/json'
    }

    payload = {
        "inputs": {},
        "query": input_text,
        "response_mode": "blocking",
        "conversation_id": "",
        "user": "merchant_user_1"
    }

    try:
        response = requests.post(DIFY_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        api_data = response.json()
        
        generated_content = api_data.get('answer', '生成失败，Dify 未返回有效内容。')
        
        return jsonify({'status': 'success', 'content': generated_content})

    except requests.exceptions.RequestException as e:
        print(f"API 调用出错: {e}")
        error_msg = str(e)
        try:
            if response.status_code == 404:
                 error_msg = "Dify API URL 不正确 (404 Not Found)。请检查 DIFY_API_URL 设置。"
            elif response.status_code == 401:
                 error_msg = "API Key 无效 (401 Unauthorized)。请检查 DIFY_API_KEY。"
        except:
            pass
             
        return jsonify({'status': 'error', 'message': error_msg})
    except Exception as e:
        print(f"发生未知错误: {e}")
        return jsonify({'status': 'error', 'message': '服务器内部错误，请查看后台日志。'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
