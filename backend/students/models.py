from django.db import models


class Students(models.Model):
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=1,null=True,blank=True) 
    age = models.IntegerField(null=True)  
    gender = models.CharField(max_length=10, null=True, blank=True) 
    category = models.CharField(max_length=2, null=True, blank=True) 
    medium = models.CharField(max_length=50, null=True, blank=True) 
    school = models.CharField(max_length=50, null=True, blank=True) 
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
