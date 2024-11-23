FROM openjdk:11-slim

RUN apt-get update && apt-get install -y coreutils

WORKDIR /sandbox

CMD ["java"]