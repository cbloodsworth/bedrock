from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pdfkit
from pdf2image import convert_from_path

app = Flask(__name__)
CORS(app)

@app.route('/save-preview', methods=['POST'])
def save_preview():
    html_content = request.json.get('htmlContent', '')

    pdf_file_path = 'public/img/previews/output.pdf'

    try:
        pdfkit.from_string(html_content, pdf_file_path)

        images = convert_from_path(pdf_file_path)

        images[0].save("public/img/previews/output.jpg", "JPEG")

        os.remove(pdf_file_path)

        return jsonify({'success': True, 'message': 'Preview saved successfully', 'pdfFilePath': pdf_file_path}), 200
    except Exception as e:
        # If an error occurs, return an error response
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
