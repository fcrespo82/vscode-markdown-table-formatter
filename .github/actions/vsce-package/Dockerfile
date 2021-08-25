# Container image that runs your code
FROM node:slim

RUN npm i -g vsce typescript

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh
# Sets run flag to entrypoint.sh
RUN chmod 700 /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]