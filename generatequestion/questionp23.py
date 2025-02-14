import random
import re
import os

def choose_random_topic(file_paths):
    """Choose a random topic and extract its elements"""
    chosen_file = random.choice(file_paths)
    with open(chosen_file, 'r', encoding='utf-8') as file:
        topics = file.read().split('topic_')

    chosen_topic = random.choice(topics).strip()
    matches = re.findall(r'\[([^]]+)\]', chosen_topic)

    part2_question = ""
    part3_questions = []
    if matches:
        elements = [element.strip() for element in matches[0].split(',')]
        part2_question = elements[0]  # Part 2 question
        part3_questions = elements[1:] if len(elements[1:]) <= 3 else random.sample(elements[1:], 3)  # Part 3 questions

    return {"part2": part2_question, "part3": part3_questions}

def generate_questions():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'part2.txt')

    # Get questions
    questions = choose_random_topic([file_path])

    return questions

def main():
    return generate_questions()

if __name__ == "__main__":
    questions = main()
    print("Part 2 Question:")
    print(questions["part2"])
    print("\nPart 3 Questions:")
    for question in questions["part3"]:
        print(question)