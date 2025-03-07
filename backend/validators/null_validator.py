from rest_framework.exceptions import ValidationError

def validate_not_none(**kwargs):
    """
    Validates multiple named parameters and raises an exception 
    if any value is null-equivalent.
    Args:
        **kwargs: Named parameters (key-value pairs) to validate.
    Raises:
        ValidationError: If any value is null-equivalent, listing the invalid fields.
    """
    
    invalid_fields = {
        key: "Value cannot be null, empty, or an empty list."
        for key, value in kwargs.items()
        if value is None or value == "" or value == []
    }
    
    if invalid_fields:
        raise ValidationError(invalid_fields)


def validate_to_none(*items):
    """Converts null-equivalent values to None.   
    This function checks each input item and replaces:
    -- None, "", "null", "None", "undefined" with None.
    Args:
        *items (any): Multiple input values to be checked and converted.

    Returns:
        tuple: A tuple where null-equivalent values are converted to None.
    """
    null_values = {None,'', '""'," ", "null", "None", "undefined"}
    cleaned_items = tuple(None if str(item).strip().strip("'").strip('"') in null_values else item for item in items)

    return cleaned_items if len(cleaned_items) > 1 else cleaned_items[0]


