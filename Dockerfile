FROM node:20

WORKDIR /app

COPY build /usr/local/bin/build

RUN chmod +x /usr/local/bin/build

ENTRYPOINT ["build"]
