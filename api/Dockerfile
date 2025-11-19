FROM maven:3.9.11-amazoncorretto-8

COPY ./lib/ /home/lib/
COPY ./src/ /home/src/
COPY pom.xml /home/
WORKDIR /home/
RUN mvn clean install

EXPOSE 8080
# preferIPv4Stack is needed to keep wildfly-swarm happy
ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "/home/target/alloy4fun-api-thorntail.jar"]
