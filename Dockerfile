FROM java:11

ENV PUID=1000
ENV GUID=1000

USER $PUID:$GUID

COPY src-java/target/knowledge-base-*.jar /app/knowledge-base.jar

EXPOSE 8080

WORKDIR /app

CMD ["java", "-jar", "/app/knowledge-base.jar"]
