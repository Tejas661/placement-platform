def calculate_ats_score(text, skills):
    score = 0
    text_lower = text.lower()

    # 1. Technical Skills
    if len(skills) >= 5:
        score += 30
    elif len(skills) >= 3:
        score += 20
    elif len(skills) >= 1:
        score += 10

    # 2. Education
    education_keywords = [
        "b.tech",
        "btech",
        "bachelor",
        "computer science",
        "education"
    ]

    if any(word in text_lower for word in education_keywords):
        score += 20

    # 3. Projects
    if "project" in text_lower or "projects" in text_lower:
        score += 20

    # 4. Experience
    if (
        "experience" in text_lower
        or "internship" in text_lower
        or "work experience" in text_lower
    ):
        score += 15

    # 5. Resume completeness
    important_sections = [
        "skills",
        "education",
        "projects"
    ]

    completed_sections = 0

    for section in important_sections:
        if section in text_lower:
            completed_sections += 1

    score += completed_sections * 5

    # Maximum score = 100
    score = min(score, 100)

    return score