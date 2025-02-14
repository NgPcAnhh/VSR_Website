import requests

# Replace with your actual ngrok URL
url = "https://ec27-34-105-50-194.ngrok-free.app/process_transcription/"
data = {
    "transcription": [
        "--- Part 1 ---",
        "examiner: What kind of work do you do?",
        "candidate: Right now, I'm the software engineer specializing in web application. My job involves coding, debugging, and collaborating with the teams to build a efficient and usefully friendly platform.",
        "examiner: Do you work best in the morning or the afternoon?",
        "examiner: Why?",
        "candidate: I am more productive in the morning because my mind is fresh and I can focus better. Also, the quiet environment in the early hour allow me to complete complex task efficiently. Incredible.",
        "examiner: Which do you use more often pen or pencil?",
        "candidate: I use a pen more frequently because it provides smoother writing experience and it's more suitable for the official documents. However, I also use pencil when sketching or taking route note. Fantastic.",
        "examiner: When was the last time you bought a pen or pencil?",
        "candidate: I bought a pen last week because my old one ran out of ink and I prefer gel pens as the grind smoothly and last longer.",
        "examiner: Do you often use your mobile phone for texting or making phone calls?",
        "candidate: I mostly use my mobile phone for texting because it is more convenient and allows me to communicate with the disrupting other. However, for Asian matter, I prefer making a phone call. That's wonderful to hear.",
        "examiner: Do you remember your first mobile phone?",
        "candidate: Yes, I do. It was a basic Nokia model with the monochrome screens and it didn't have many features but it was durable and had a long battery life.",
        "examiner: Do you like swimming?",
        "candidate: Yes, I love swimming. It is a great way to stay fit and relax especially on the hot summer day.",
        "examiner: Why do many people like swimming?",
        "candidate: Many people enjoy swimming because it's a low impact exercise that works as whole bodies and it also refresh a way to unwind and relieve stress. .",
        "examiner: Do you watch science programs on TV?",
        "candidate: Yes, I occasionally watch science documentaries on channels like National Geographic or Discoveries. I try to provide fascinating insight into space technologies and also the natural. Fantastic.",
        "examiner: Is it easy for you to learn science subjects?",
        "candidate: I find science subjects quite challenging for me but I enjoy them because they explain how the world works and understanding the concept requires logical thinking and practice.",
        "--- Part 2 ---",
        "examiner: Describe a group or a club you have ever joined",
        "candidate:  One of the most memorable clubs I have ever joined was my university's debate club. I became a member in my second year of university because I wanted to improve my public speaking and critical thinking skills. The club was well organized with weekly meetings, held a large lecture halls on campus. Each section was attained by students from different faculties which made discussion even more engaging and diverse. When I first joined, I was quite nervous because I had a little experience in form rebate. However, the senior members were very supportive and guided new members through the process. Every week we would be assigned different topics ranging from social issue and politics to science and ethics. We had to research the topics, prepare arguments and then participate in structural debate when we took to presenting our viewpoint. One of the most exciting experiences I had in my club was participating in inter-university debate competitions. It was challenging yet rewarding experience because I had to compete against teams from other universities. I spent our practicings with my teammates, refining my arguments and learning how to respond to the counter-agumings. Effectively, although my team did not win the competitions, I also gained valuable skill in logical reasonings, persuasive speaking and teamwork.",
        "--- Part 3 ---",
        "examiner: Now let's move on to part 3.",
        "examiner: Are there any downsides to being part of a group or club?",
        "candidate: Yes, sometimes being in groups can be time consuming and require commitment. Conflicts may also arise due to the difference in opinions and personal lies.",
        "examiner: How important are extracurricular activities for students?",
        "candidate: Extracurricular activities are essential for students. As they helped develop soft skills, foster teamwork and provide a break from academic stress. Wonderful.",
        "examiner: What are the benefits of joining a group or club?",
        "candidate: Joining a group helps people build social connection, improve communication skills, and gain new knowledge or experience in structure and environment.",
        "examiner: How have online groups and communities changed social interactions?",
        "candidate: An online group have made social interaction more accessible and inclusive, allowing people to connect globally. However, they sometimes reduce face-to-face communications, leading to weaker real-world social skills."
    ]
}

response = requests.post(url, json=data)
print(response.status_code)
try:
    response_json = response.json()
    print(response_json)
except requests.exceptions.JSONDecodeError:
    print("Response is not in JSON format.")
    print(response.content)