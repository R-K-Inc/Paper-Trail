FROM python:alpine

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0", "--port", "8000", "--reload"]

EXPOSE 8000