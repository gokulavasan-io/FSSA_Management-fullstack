from django.db import models

class Prompt(models.Model):
    prompt = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt

class AiResponse(models.Model):
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer to: {self.prompt.prompt}"
