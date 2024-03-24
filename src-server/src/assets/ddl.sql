CREATE TABLE db_record (
    id  VARCHAR (64) PRIMARY KEY
                     NOT NULL,
    rev VARCHAR (64) NOT NULL
                     DEFAULT (''),
    val TEXT         NOT NULL
                     DEFAULT ('')
);
