# wishrhit schema
 
# --- !Ups
 
CREATE TABLE Login (
    login_id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NULL,
    passwordencrypted binary(20) NULL,
    salt binary(16)  NULL,
    login_profile_id bigint  NULL,
    resetPassword tinyint(1) default 0,
    createddate datetime NULL,
    modifieddate datetime NULL,
    PRIMARY KEY (login_id)
);

CREATE TABLE LoginDetails (
    profile_id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    fullname varchar(255) NOT NULL,
    phone varchar(255) NOT NULL,
    createddate datetime NULL,
    modifieddate datetime NULL,
    PRIMARY KEY (profile_id)
);

alter table login add constraint fk_profile_login_1 foreign key (login_profile_id) references LoginDetails (profile_id) on delete restrict on update restrict;
create index ix_profile_login_1 on login (login_profile_id);

 
# --- !Downs
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE Login;
DROP TABLE LoginDetails;
SET FOREIGN_KEY_CHECKS=1;