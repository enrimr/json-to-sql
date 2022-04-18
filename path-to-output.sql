CREATE TABLE IF NOT EXISTS recipes (id TEXT,title TEXT,portions TEXT);
CREATE TABLE IF NOT EXISTS tm_versions (mainTableId TEXT,order INTERGER,name TEXT);
CREATE TABLE IF NOT EXISTS nutritions (information TEXT,calories TEXT,proteins TEXT,carbohydrates TEXT,fats TEXT,fiber TEXT,mainTableId TEXT);
CREATE TABLE IF NOT EXISTS steps (mainTableId TEXT,order INTERGER,name TEXT);
INSERT INTO recipes (id,title,portions) VALUES ("r55683","Pisto","6 raciones");
INSERT INTO tm_versions (mainTableId,order,name) VALUES ("r55683",0,"tm6");
INSERT INTO tm_versions (mainTableId,order,name) VALUES ("r55683",1,"tm5");
INSERT INTO nutritions (information,calories,proteins,carbohydrates,fats,fiber,mainTableId) VALUES ("por 1 ración","792 kj / 189 kcal","2.56 g","8.28 g","16.85 g","2.98 g","r55683");
INSERT INTO steps (mainTableId,order,name) VALUES ("r55683",0,"step 1");
INSERT INTO steps (mainTableId,order,name) VALUES ("r55683",1,"step 2");
INSERT INTO steps (mainTableId,order,name) VALUES ("r55683",2,"step 3");
INSERT INTO recipes (id,title,portions) VALUES ("r55690","Tortilla","3 raciones");
INSERT INTO tm_versions (mainTableId,order,name) VALUES ("r55690",0,"tm6");
INSERT INTO tm_versions (mainTableId,order,name) VALUES ("r55690",1,"tm5");
INSERT INTO tm_versions (mainTableId,order,name) VALUES ("r55690",2,"tm31");
INSERT INTO nutritions (information,calories,proteins,carbohydrates,fats,fiber,mainTableId) VALUES ("por 1 ración","792 kj / 189 kcal","2.56 g","8.28 g","16.85 g","2.98 g","r55690");
INSERT INTO steps (mainTableId,order,name) VALUES ("r55690",0,"step 11");
INSERT INTO steps (mainTableId,order,name) VALUES ("r55690",1,"step 22");
INSERT INTO steps (mainTableId,order,name) VALUES ("r55690",2,"step 33");