from django.db import models

class Section(models.Model):
    name = models.CharField(max_length=50, unique=True, null=True)

    
    class Meta:
        ordering = ['name']
        
    def __str__(self):
        return self.name
    
    
class Batch(models.Model):
    batch_no = models.IntegerField(unique=True, null=True)  
    def __str__(self):
        return "Batch " + str(self.batch_no)

GENDER_CHOICES=[
    ("Male","Male"),
    ("Female","Female"),
    ("Other","Other")
]


CATEGORY_CHOICES = [
    ("A", "A"),
    ("B", "B"),
    ("C+", "C+"),
    ("D", "D"),
    ("E", "E"),
]

MEDIUM_CHOICES = [
    ("Tamil", "Tamil"),
    ("English", "English"),
    ("Other", "Other"),
]

SCHOOL_CHOICES = [
    ("Private", "Private"),
    ("Govt", "Government"),
    ("Govt-Aided", "Government-Aided"),
]

class Students(models.Model):
    name = models.CharField(max_length=255)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="students", null=True)  
    age = models.IntegerField(null=True)  
    gender = models.CharField(max_length=10,choices=GENDER_CHOICES, null=True, blank=True) 
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES, null=True, blank=True) 
    medium = models.CharField(max_length=10, choices=MEDIUM_CHOICES, null=True, blank=True) 
    school = models.CharField(max_length=15, choices=SCHOOL_CHOICES, null=True, blank=True) 
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
