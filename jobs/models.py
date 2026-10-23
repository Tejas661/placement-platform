from django.db import models
from django.contrib.auth.models import User
class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    description = models.TextField()
    required_skills = models.TextField()
    salary = models.CharField(max_length=100)
    deadline = models.DateField()

    def __str__(self):
        return self.title



class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return self.user.username + " - " + self.job.title