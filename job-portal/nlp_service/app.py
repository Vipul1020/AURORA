from flask import Flask, request, jsonify
import spacy
import logging
from spacy.matcher import PhraseMatcher

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

NLP_MODEL_NAME = "en_core_web_md"
nlp = None
try:
    nlp = spacy.load(NLP_MODEL_NAME)
    logging.info(f"✅ spaCy model '{NLP_MODEL_NAME}' loaded successfully.")
except OSError:
    logging.error(f"❌ Error loading spaCy model '{NLP_MODEL_NAME}'.")
    logging.error(f"Make sure you've run: python -m spacy download {NLP_MODEL_NAME}")

TARGET_KEYWORDS = [
    "python", "java", "javascript", "typescript", "sql", "html", "css", "c#", "c++", "php", "ruby", "go", "swift", "kotlin", "scala",
    "react", "react.js", "angular", "vue", "vue.js", "redux", "jquery", "bootstrap", "tailwind", "svelte",
    "node.js", "express", "express.js", "spring", "spring boot", "django", "flask", "fastapi", ".net", "ruby on rails", "laravel",
    "mongodb", "postgresql", "mysql", "nosql", "redis", "oracle", "sqlite", "cassandra",
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "git", "jenkins", "ci/cd", "terraform", "ansible", "heroku", "linux", "windows",
    "rest", "restful", "api", "apis", "graphql", "microservices", "agile", "scrum", "oop", "mvc", "serverless", " TDD", "bdd",
    "machine learning", "deep learning", "data analysis", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "nlp", "natural language processing",
    "jira", "selenium", "power bi", "tableau",
    "full stack", "frontend", "backend", "devops", "data analyst", "data scientist", "data engineer", "qa", "testing", "software engineer", "developer"
]

matcher = None
if nlp:
    try:
        matcher = PhraseMatcher(nlp.vocab, attr='LOWER')
        patterns = [nlp.make_doc(text) for text in TARGET_KEYWORDS]
        matcher.add("KeywordList", patterns)
        logging.info(f"✅ PhraseMatcher initialized with {len(TARGET_KEYWORDS)} keywords.")
    except Exception as e:
        logging.error(f"❌ Error initializing PhraseMatcher: {e}")
        matcher = None

app = Flask(__name__)

@app.route('/')
def home():
    return "NLP Service is running!"

@app.route('/extract-keywords', methods=['POST'])
def extract_keywords_route():
    if not nlp or not matcher:
         logging.error("spaCy model or Matcher not loaded, cannot process request.")
         return jsonify({"error": "NLP service not ready. Check server logs."}), 500

    if not request.is_json:
        logging.warning("Request received without JSON content type.")
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    if not data:
         return jsonify({"error": "Request body is empty or not valid JSON"}), 400

    text_data = data.get('text', '')
    if not text_data or not isinstance(text_data, str) or not text_data.strip():
        return jsonify({"error": "No 'text' field provided or text is empty in JSON body"}), 400

    logging.info(f"Received request to extract keywords from text (length: {len(text_data)}).")
    final_keywords_set = set()

    try:
        doc = nlp(text_data)

        try:
            matches = matcher(doc)
            matched_keywords = set()
            for match_id, start, end in matches:
                span = doc[start:end]
                matched_keywords.add(span.text.lower())

            logging.info(f"Matcher found: {list(matched_keywords)}")
            final_keywords_set.update(matched_keywords)
        except Exception as e:
            logging.error(f"Error during PhraseMatcher execution: {e}")

        ner_keywords = set()
        allowed_entity_labels = {
            'ORG',
            'PRODUCT',
            'GPE',
            'LOC',
            'WORK_OF_ART',
            'LANGUAGE',
        }
        for ent in doc.ents:
            if ent.label_ in allowed_entity_labels and len(ent.text) > 1:
                 lowercase_ent = ent.text.lower()
                 if lowercase_ent not in ['inc', 'llc', 'ltd', 'gmbh', 'corp', 'solutions', 'systems', 'group', 'technologies']:
                     is_substring = False
                     for keyword in final_keywords_set:
                         if keyword != lowercase_ent and lowercase_ent in keyword:
                             is_substring = True
                             break
                     if not is_substring:
                         ner_keywords.add(lowercase_ent)
        logging.info(f"NER found (after filter): {list(ner_keywords)}")
        final_keywords_set.update(ner_keywords)

        final_keywords_list = sorted(list(final_keywords_set))
        logging.info(f"Combined & Final keywords: {final_keywords_list}")

        return jsonify({"keywords": final_keywords_list})

    except Exception as e:
        logging.error(f"Error during NLP processing: {e}")
        return jsonify({"error": "Failed to process text due to an internal error"}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)