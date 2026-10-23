import re


skill_list = [
    "java",
    "python",
    "c++",
    "javascript",
    "react",
    "node.js",
    "django",
    "sql",
    "mysql",
    "mongodb",
    "html",
    "css",
    "git",
    "github",
    "machine learning",
    "deep learning",
    "data structures",
    "algorithms",
]


def process_resume(text):

    resume_text = text.lower()

    skills = []

    for skill in skill_list:
        if skill in resume_text:
            skills.append(skill)

    return {
        "tokens": [],
        "entities": [],
        "skills": skills
    }