import 'dotenv/config'; 

import { dbconnection } from "./Database/dbconnection.js";
import app from "./app.js";

dbconnection();

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`🚀 Server is running at http://127.0.0.1:${port}`);
});
