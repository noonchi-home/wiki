# 시작하기

```bash
npm install
npm --prefix ui install
cp .env.example .env
```

`.env`에 `OPENAI_API_KEY`를 설정한 뒤 서버를 시작한다.

```bash
npm start
```

로컬 대시보드는 `http://127.0.0.1:8200`에서 연다. 실제 폰을 연결하려면 폰이 접속할 수 있는 HTTPS origin으로 허브를 공개한다. 설치한 Android 앱에서 대시보드의 QR 코드를 찍거나, 브라우저에서 같은 `/mobile/` URL을 연다. TWA를 쓰기 전에 AR origin과 APK의 공개 서명 인증서를 설정한다.

GPU 서버에 배포하려면 다음 명령을 실행한다.

```bash
docker compose --env-file .env -f deploy/compose.yaml --profile gpu up -d --build
```
