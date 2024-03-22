from app import app, db, models

with app.app_context():
    db.drop_all()
    db.create_all()

    user = models.User(username='test_user', password='password')  # replace 'password' with the actual password
    db.session.add(user)
    db.session.commit()  # commit to get the user_id

    # Create a new resume
    resume = models.Resume(title="Esteban's Resume", user_id=user.user_id)
    db.session.add(resume)
    db.session.commit()

    # Create new sections, entries, and bullet points
    sections = [
        {
            'title': 'Education',
            'entries': [
                {
                    'title': 'University of Florida | Gainesville, FL',
                    'bullets': ['B.S in Computer Science and Minor in mathematics | GPA: 4.0/4.0']
                }
            ]
        },
        {
            'title': 'Experience',
            'entries': [
                {
                    'title': 'Software Engineer Intern | Bank of America (2023)',
                    'bullets': ['Helped create API call for new feature and used tools like Splunk to review code defects']
                },
                {
                    'title': 'Computer Science Tutor | University of Florida (Fall 2022 - Fall 2023)',
                    'bullets': ['Tutored students in introductory Computer Science classes such as Data Structures and intro to programming']
                },
                {
                    'title': 'Software Engineer | Bank of America (2024)',
                    'bullets': ['Worked on API calls using Java']
                }
            ]
        },
        {
            'title': 'Projects',
            'entries': [
                {
                    'title': 'Interpreter | Junit, Java, Git',
                    'bullets': [
                        'Created an interpreter consisting of a Lexer, Parser, Interpreter, Analyzer and Generator',
                        'Implemented more than 300 unit tests using Junit to ensure perfect functionality'
                    ]
                },
                {
                    'title': 'SFML Piano | SFML, C++, Git',
                    'bullets': [
                        'Used SFML to create a piano visualizer that interprets midi files and then shows the notes falling'
                    ]
                },
                {
                    'title': 'Senior Project | React, Typescript, Git',
                    'bullets': [
                        'Used react to create a resume drag and drop website',
                        'worked on the frontend interface using mostly Typescript'
                    ]
                }
            ]
        }
    ]

    for i, section_data in enumerate(sections):
        section = models.Section(title=section_data['title'], resume_id=resume.resume_id, order_number=i)
        db.session.add(section)
        db.session.commit()  # commit to get the section_id

        for i, entry_data in enumerate(section_data['entries']):
            entry = models.Entry(title=entry_data['title'], section_id=section.section_id, order_number=i)
            db.session.add(entry)
            db.session.commit()  # commit to get the entry_id

            for bullet in entry_data['bullets']:
                bullet_point = models.BulletPoint(content=bullet, entry_id=entry.entry_id)
                db.session.add(bullet_point)

    db.session.commit()
    print("Complete")