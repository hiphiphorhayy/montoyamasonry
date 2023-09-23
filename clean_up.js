import mysq12 from 'mysql';

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE 
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    } else {
        console.log('Connected to MySQL database');
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleteQuery = 'DELETE FROM contact_form_submissions WHERE created_at < ?';
    const values = [thirtyDaysAgo];

    connection.query(deleteQuery, values, (err, results) => {
        if (err) {
            console.error('Error deleting old records:', err);
        } else {
            console.log( `Deleted ${results.affectedRows} old records`);
        }

        connection.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    });
});