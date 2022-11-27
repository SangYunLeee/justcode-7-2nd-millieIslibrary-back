FROM node:16-alpine

WORKDIR /usr/src/app

# 현재 패키지 설치 정보(package.json, package-lock.json)를 Docker 이미지에 복사합니다.
COPY package*.json ./

RUN npm install pm2 -g

RUN npm install

# 현재 경로에 존재하는 모든 파일을 Docker 이미지에 복사합니다.
COPY . .
EXPOSE 8000

# === 도커가 이미지를 빌드할 때의 명렁어

CMD ["pm2-runtime", "server.js", "--name", "millie", "-i", "max"]
