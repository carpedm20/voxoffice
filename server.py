from flask import Flask
from flask import url_for, redirect, render_template
app = Flask(__name__, static_url_path="/carpedm20/vox/static",)

import re
from glob import glob

PREFIX = "carpedm20/"
STATIC = "%sstatic" % PREFIX

@app.route('/')
@app.route('/carpedm20/')
def root():
    return redirect(url_for('index'))

@app.route('/carpedm20/vox/')
def index():
    global PREFIX, STATIC

    years = glob("./static/all-*.json")
    years = [re.findall(r'\d+',year)[0] for year in years]
    years.sort(reverse=True)

    return render_template('index.html', years = years)

@app.route('/carpedm20/vox/music')
def music():
    global PREFIX, STATIC

    years = glob("./static/music-*.json")
    years = [re.findall(r'\d+',year)[0] for year in years]
    years.sort(reverse=True)

    return render_template('index.html', years = years)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
