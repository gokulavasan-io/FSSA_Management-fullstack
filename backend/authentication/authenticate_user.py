from django.http import JsonResponse

def authenticate_user(view_func):
    def wrapper(self, request, *args, **kwargs):
        if not request.user_email:
            response = JsonResponse({"error": "Unauthorized"}, status=401)
            response.delete_cookie("session_token")  # Remove token on logout
            return response

        return view_func(self, request, *args, **kwargs)

    return wrapper
