FROM swift:latest
RUN apt-get update && apt-get install -y coreutils
WORKDIR /sandbox
CMD ["swift"]