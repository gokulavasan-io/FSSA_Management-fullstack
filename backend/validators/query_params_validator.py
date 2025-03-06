from functools import wraps
from rest_framework.exceptions import ValidationError

def validate_query_params(required_params):
    """
    Decorator to validate required query parameters in a DRF APIView.
    :param required_params: List of required query parameters
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            missing_params = [
                param for param in required_params if not request.query_params.get(param)
            ]
            if missing_params:
                raise ValidationError({"error": f"Missing required parameters: {', '.join(missing_params)}"})
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator
