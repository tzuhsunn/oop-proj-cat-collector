# Containerize a ScritchCare backend & forntend & nginx with docker
1. Add `.env` file in backend/frontend
- frontend
```
REACT_APP_TAPPAY_ID=
REACT_APP_TAPPAY_KEY=
REACT_APP_IP=http://${hostname}/
```

- backend
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_KEY=
INFLUX_URL=
INFLUX_TOKEN=
INFLUX_ORG=
INFLUX_BUCKET=
```

2. Run `docker compose -f docker-compose.yml up -d` to start the container