import os
import openai
from dotenv import load_dotenv
import json
import requests

load_dotenv()

class GPTAssistant:
    def __init__(self):
        self.token = os.getenv("GITHUB_TOKEN")
        self.endpoint = "https://models.inference.ai.azure.com"
        self.model_name = "gpt-4o-mini"
        openai.api_key = self.token
        openai.api_base = self.endpoint
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_categories",
                    "description": "Get list of product categories from store",
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_top_food",
                    "description": "Get top 5 food from store",
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_service",
                    "description": "Get service by name",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "category_name": {
                                "type": "string",
                                "description": "Category name",
                                "example": "Food, Drinks, Laundry, etc"
                            }
                        },
                        "required": []
                    }
                }
            }
        ]

    def get_categories(self):
        """Get list of product categories from store"""
        response = requests.get("https://huyitshop.online:444/api/v1/categories")
        data = response.json()
        # print(data)
        categories = []
        for category in data["result"]:
            categories.append({
                "name": category["categoryName"],
                "id": category["categoryId"],
                "sequence": category["categorySeq"],
                "imageLink": category["imageLink"],

            })
        return json.dumps({"categories": categories}, ensure_ascii=False)

    def get_top_food(self):
      """Get top 5 food from store"""
      response = requests.get("https://huyitshop.online:444/api/v1/main-advertisements/top-food")
      data = response.json()
      products = []
      for product in data["result"]:
        products.append({
        "name": product["mainAdvertisementName"],
        "id": product["advertisementId"],
        "price": product["priceRangeLow"],
        "address": product["address"],
        "phoneNumber": product["phoneNumber"],
        "priceRangeLow": product["priceRangeLow"],
        "priceRangeHigh": product["priceRangeHigh"],
        "imageLink": product["mediaList"][0]["url"] if product["mediaList"] else None
        })
      return json.dumps({"products": products}, ensure_ascii=False)

    def get_service(self, category_name: str = ""):
        """Get service by name"""
        response = requests.get(f"https://huyitshop.online:444/api/v1/advertisement-services/category?categoryName={category_name}")
        data = response.json()
        services = []
        for service in data["result"]:
            services.append({
                "name": service["serviceName"],
                "id": service["serviceId"],
                "deliveryAvailable": service["deliveryAvailable"],
            })
        return json.dumps(data, ensure_ascii=False)


    def process_message(self, user_message: str):
        print(user_message)
        messages = [
            {"role": "system", "content": "Luôn trả về câu trả lời trong 1 dòng không có ký tự đặc biệt với format thật đẹp và dễ đọc. Lưu ý trả lời ngắn gọn đầy đủ ý không dài dòng bỏ các ký tự \\n ra khỏi câu trả lời và chỉ trả lời và không được trả lời những thứ không liên quan đến hệ thống. nếu được hỏi về dịch vụ nhớ chuyển về tiếng anh như food, drinks, laundry, etc. Và câu trả lời nên đưa tiếng việt như food thì để là thức ăn. Nếu dữ liệu nào không có thì trả lời tôi hiện không có thông tin này để cung cấp cho bạn"} ,
            {"role": "user", "content": user_message}
        ]

        response = openai.ChatCompletion.create(
            messages=messages,
            tools=self.tools,
            model=self.model_name,
        )

        if response.choices[0].finish_reason == "tool_calls":
            messages.append(response.choices[0].message)

            for tool_call in response.choices[0].message.tool_calls:
                if tool_call.type == "function":
                    function_args = json.loads(tool_call.function.arguments.replace("'", '"'))
                    print(f"Calling function `{tool_call.function.name}` with arguments {function_args}")
                    callable_func = getattr(self, tool_call.function.name)
                    function_return = callable_func(**function_args)
                    print(f"Function returned = {function_return}")

                    messages.append(
                        {
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": tool_call.function.name,
                            "content": function_return,
                        }
                    )

            response = openai.ChatCompletion.create(
                messages=messages,
                tools=self.tools,
                model=self.model_name,
            )

        return response

