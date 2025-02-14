import unittest
import requests


class TestSpeechToTextAPI(unittest.TestCase):
    API_URL = "https://9076-34-105-50-194.ngrok-free.app/transcribe_and_process"  # đổi url theo server api khởi tạo
    TEST_FILE_PATH = "test_audio.wav"  # Path to the test WAV file

    def test_transcribe_and_process(self):
        with open(self.TEST_FILE_PATH, 'rb') as f:
            files = {'file': f}
            response = requests.post(self.API_URL, files=files, headers={'Accept': 'application/json'})

            self.assertEqual(response.status_code, 200)

            data = response.json()
            self.assertIn('conversation', data)
            self.assertIn('relevance', data)
            self.assertIn('analysis', data)

            # Check if the conversation contains expected parts
            conversation = data['conversation']
            self.assertTrue(any("--- Part 1 ---" in s for s in conversation))
            self.assertTrue(any("--- Part 2 ---" in s for s in conversation))
            self.assertTrue(any("--- Part 3 ---" in s for s in conversation))

    def test_invalid_file_format(self):
        with open(__file__, 'rb') as f:  # Using the current script file which is not a WAV file
            files = {'file': f}
            response = requests.post(self.API_URL, files=files, headers={'Accept': 'application/json'})

            self.assertEqual(response.status_code, 400)

            data = response.json()
            self.assertIn('error', data)
            self.assertEqual(data['error'], "Invalid file format. Only WAV files are accepted")


if __name__ == '__main__':
    unittest.main()