FROM heroku/miniconda


# Add our code
ADD ./webapp /opt/webapp/
WORKDIR /opt/webapp

RUN conda install scikit-learn
RUN conda install keras
RUN conda install tensorflow
RUN conda install numpy

CMD gunicorn --bind 0.0.0.0:$PORT wsgi