from django.db import models

class Section(models.Model):
    name = models.CharField(max_length=1, null=True)  

class Students(models.Model):
    name = models.CharField(max_length=255)
    
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="students", null=True)  

    age = models.IntegerField(null=True)  
    gender = models.CharField(max_length=10, null=True, blank=True) 
    category = models.CharField(max_length=2, null=True, blank=True) 
    medium = models.CharField(max_length=50, null=True, blank=True) 
    school = models.CharField(max_length=50, null=True, blank=True) 