from django.urls import path

from .views import create_job,get_jobs,apply_job, my_applications,recommended_jobs,job_applicants,update_job, delete_job


urlpatterns = [
    path('create/', create_job),
    path('', get_jobs),
    path('apply/<int:job_id>/', apply_job),
    path('my-applications/', my_applications),
    path('recommended/', recommended_jobs),
    path('applicants/<int:job_id>/', job_applicants),
    path('update/<int:job_id>/', update_job),
    path('delete/<int:job_id>/', delete_job),
]