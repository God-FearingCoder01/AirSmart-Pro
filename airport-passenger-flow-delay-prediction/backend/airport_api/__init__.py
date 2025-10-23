# Enable PyMySQL as a drop-in replacement for MySQLdb if mysqlclient isn't available.
try:
	import pymysql  # type: ignore
	pymysql.install_as_MySQLdb()
except Exception:
	# If mysqlclient is available or pymysql not installed, ignore.
	pass