import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
import google.generativeai as genai
from datetime import datetime


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class GenerateResponseView(APIView):
    def post(self, request):
        prompt = request.data.get('prompt', '')

        if not prompt:
            return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = model.generate_content(prompt)
            aiResponse = response.text.strip()

            prompt = Prompt.objects.create(prompt=prompt)
            AiResponse.objects.create(prompt=prompt, ai_response=aiResponse)

            return Response({
                "prompt": prompt.prompt,
                "response": aiResponse,
                'time':datetime.now().isoformat(),
                'id':prompt.id,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class ChatData(APIView):
    def get(self, request):
        prompts = Prompt.objects.all()

        data = []
        for prompt in prompts:
            response = AiResponse.objects.filter(prompt=prompt).first()
            if response:
                data.append({
                    "prompt": prompt.prompt,
                    "response": response.ai_response,
                    'time':response.created_at,
                    'id':prompt.id,
                })
        
        return Response(data, status=status.HTTP_200_OK)
    
class DeleteChat(APIView):
    def delete(self, request, id=None):
        try:
            prompt = Prompt.objects.get(id=id)
            AiResponse.objects.filter(prompt=prompt).delete()
            prompt.delete()  
            return Response({"message": "Message deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Prompt.DoesNotExist:
            return Response({"error": "Prompt not found"}, status=status.HTTP_404_NOT_FOUND)
