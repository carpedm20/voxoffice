from django.shortcuts import render

def index(request):
    template = "index.html"

    return render(request,
                  template,
                  {'title' : 'welcome'})

def practice(request):
    template = "practice.html"

    return render(request,
                  template,
                  {'title' : 'practice d3.js'})
