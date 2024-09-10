                               // Define Middleware

import express from 'express';
const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// if(file above to 16kb){
//     return 413 paylod largr error
// }

app.use(express.static("public")); // handle statics file i.e css, images, js

            // Import Routes of all Controllers 

import classRouter from './routes/class.route.js'
import videoRouter from './routes/video.route.js'


app.use("/api/task/class", classRouter)
app.use("/api/task/video", videoRouter)

export { app }