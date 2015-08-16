from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser
from flask import Flask
from flask.ext.cors import CORS, cross_origin
import os
import json
import ConfigParser

config = ConfigParser.RawConfigParser()
config.read(os.path.dirname(os.path.abspath(__file__)) + "\\youtube.properties")
DEVELOPER_KEY = config.get('YoutubeSection', 'youtube.key');
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@cross_origin()
@app.route('/api/search/<query>')
def index(query):
    return youtube_search(query, 10)

def youtube_search(query, max_results):
  youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)

  search_response = youtube.search().list(
    q=query,
    type="video",
    part="id,snippet",
    maxResults=max_results
  ).execute()

  videos = []

  for search_result in search_response.get("items", []):
    video = {}
    video["id"] = search_result["id"]["videoId"]
    video["title"] = search_result["snippet"]["title"]
    videos.append(video)

  json_data = json.dumps(videos)
  return json_data

if __name__ == "__main__":
  app.run(debug=False)
