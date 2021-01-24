oomap uses a mysql database - to store saved maps and controls, look up postcodes and track which postcodes were used.  The sql commands below will create the required tables.  You then need to add the database details (credentials and database name) to www/oomap.co.uk/db.php
The postcodes table then needs to be popupated from the Ordnance Survey Code-Point open dataset from https://osdatahub.os.uk/downloads/open/CodePointOpen

```sql
CREATE TABLE map(
	id INT,
	shortcode VARCHAR(255),
	action VARCHAR(255),
	title VARCHAR(255),
	race_instructions TEXT(2047),
	eventdate DATE,
	club VARCHAR(255),
	style VARCHAR(255),
	scale VARCHAR(255),
	papersize VARCHAR(255),
	paperorientation VARCHAR(255),
	centre_lat REAL,
	centre_lon REAL,
	created_by VARCHAR(255),
	created_by_ip VARCHAR(255),
	created_by_domain VARCHAR(255),
	created_date DATE,
	access_count INT,
	last_accessed DATE
) ENGINE=INNODB;
```

```sql
CREATE TABLE control(
	id INT,
	type VARCHAR(255),
	label VARCHAR(255),
	label_angle REAL,
	score VARCHAR(255),
	lat REAL,
	lon REAL,
	description VARCHAR(255)
) ENGINE=INNODB;
```

```sql
CREATE TABLE postcodes(
	postcode_7 VARCHAR(7),
	easting INT,
	northing INT
) ENGINE=INNODB;
```

```sql
CREATE TABLE pcrequests(
	postcode_7 VARCHAR(7) PRIMARY KEY,
	hits INT,
	source VARCHAR(20)
) ENGINE=INNODB;
```
