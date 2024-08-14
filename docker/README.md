# Docker-Compose

This docker-compose file may be used to deploy a stack of containers containing: webrcade, owncloud & its necessary databases for user and file management.

## Installation

After downloading the docker-compose.yml file, open it in notepad and set the following variables:

- webRcade
  - volumes
    - owncloud storage path
    - owncloud username (use admin username during initial setup)
- ownCloud
  - environment
    - server IP address
    - admin username
    - admin password
  - volumes
    - owncloud storage path

Then deploy the docker-compose file by using the following or uploading the `docker-compose.yml` into [Portainer (web GUI for docker)](https://hub.docker.com/r/portainer/portainer-ce):

```sh
docker-compose up
```

***
**Note:** File/folder changes need to be done using the ownCloud interface for them to be tracked. It does not auto scan folders for changes.
***

After all the containers are up and running on your docker host, you will need to run a manual file scan to recognize the webrcade folder and contents within. This is done by accessing the terminal inside the container using the following:

```sh
docker exec -ti webrcade-owncloud entrypoint bash
```

Now that you're inside the container, start the file scan:

```sh
occ files:scan --all
```

- webRcade can be reached at [http://localhost/](http://localhost/)
- ownCloud can be reached at [http://localhost:8080/](http://localhost:8080/) or [https://localhost/](https://localhost/)

At this point, you are up and running. The suggested final step is to enter the ownCloud interface with admin, create a new user, then edit the docker-compose file's webrcade volume path to that new username and redeploy the stack.

## External Access

***WARNING!*** Do not forward port 80 as that points to webRcade. This project is in early development with focuses on functionality not security. webRcade will not be held liable for damages done by external attacks.

To access ownCloud from the web, [forward port](https://www.noip.com/support/knowledgebase/general-port-forwarding-guide/) 443 for https from your external router (internet facing) to your docker host IP address.

Most users receive a dynamic IP address from their ISP and as such, it is not a reliable link to use when importing content into your feeds. As such, its best to use the [DDNS](https://en.wikipedia.org/wiki/Dynamic_DNS) feature included in most modern routers to reflect any changes of your external IP address to a DNS server.

TL;DR IP addresses change but names are forever (terms & conditions apply)

[Afraid.org (aka FreeDNS)](https://freedns.afraid.org/) is a simple, cost effective DNS server solution and they have detailed instructions on the website.
