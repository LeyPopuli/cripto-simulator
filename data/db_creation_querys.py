# TRANSACTION TABLE CREATION

"""
CREATE TABLE "transaction" (
	"id_transaction"	INTEGER NOT NULL UNIQUE,
	"datetime"	TEXT NOT NULL,
	"origin_currency"	TEXT NOT NULL,
	"destination_currency"	TEXT NOT NULL,
	"destination_amount"	REAL NOT NULL,
	PRIMARY KEY("id_transaction" AUTOINCREMENT)
);
"""

# USER TABLE CREATION
