name := """wishrhit"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.6"

libraryDependencies ++= Seq(
"org.hibernate" % "hibernate-core" % "4.3.4.Final",
    "org.hibernate" % "hibernate-entitymanager" % "4.3.4.Final",
    "org.hibernate.javax.persistence" % "hibernate-jpa-2.1-api" % "1.0.0.Final",
    "org.apache.poi"  % "poi"  % "3.10-FINAL",
    "org.mindrot" % "jbcrypt" % "0.3m",
    jdbc,
    javaCore,
    javaJdbc,
    javaWs,
    javaJpa.exclude("org.hibernate.ejb.HibernatePersistence", "hibernate-jpa-2.0-api"),
     cache,
      "mysql" % "mysql-connector-java" % "5.1.18",
     "com.feth" % "play-easymail_2.11" % "0.7.0",
      "org.apache.commons" % "commons-pool2" % "2.4.2"
)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator

libraryDependencies += evolutions
