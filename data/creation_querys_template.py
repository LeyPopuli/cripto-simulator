# TRANSACTION TABLE CREATION

"""
CREATE TABLE "transaction" (
	"id_transaction"	INTEGER NOT NULL UNIQUE,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"origin_currency"	TEXT NOT NULL,
	"origin_amount"	REAL NOT NULL,
	"destination_currency"	TEXT NOT NULL,
	"destination_amount"	REAL NOT NULL,
	PRIMARY KEY("id_transaction" AUTOINCREMENT)
);
"""

# USER TABLE CREATION
"Pending version 2.0"
