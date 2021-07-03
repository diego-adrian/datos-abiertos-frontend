# etapa de compilación
FROM node:12.20-slim as build-stage
WORKDIR /app
COPY package*.json ./
# RUN apk add build-base
ARG CI_COMMIT_SHORT_SHA
ARG CI_COMMIT_MESSAGE
ARG CI_COMMIT_REF_NAME
ARG VUE_APP_FRONTEND
ARG VUE_APP_API_URL
ARG VUE_APP_BASE_SERVER
ARG VUE_APP_PUBLIC_PATH
ENV CI_COMMIT_SHORT_SHA=${CI_COMMIT_SHORT_SHA} \
    CI_COMMIT_MESSAGE=${CI_COMMIT_MESSAGE} \
    CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME} \
    VUE_APP_FRONTEND=${VUE_APP_FRONTEND} \
    VUE_APP_API_URL=${VUE_APP_API_URL} \
    VUE_APP_BASE_SERVER=${VUE_APP_BASE_SERVER} \
    VUE_APP_PUBLIC_PATH=${VUE_APP_PUBLIC_PATH}
RUN npm set registry https://registry.upat.agetic.gob.bo
RUN npm set strict-ssl false
RUN npm ci
COPY . .
RUN npm run build

# etapa de despliegue
FROM nginx:1.13.12-alpine as deploy-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
